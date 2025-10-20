import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";
import { ProjectTagSchema } from "../project-tag/model";

export async function create(project, tag_ids) {
  const db = await getDB();

  const result = await db.collection("projects").insertOne({
    ...project,
    createdAt: new Date(),
  });

  const projectId = result.insertedId;

  if (tag_ids.length) {
    const projectTags = tag_ids.map((tagId) => ({
      projectId,
      tagId: new ObjectId(tagId),
    }));

    const parsedData = projectTags.map((projectTag) =>
      ProjectTagSchema.parse(projectTag)
    );

    await db.collection("projectTags").insertMany(parsedData);
  }

  return result;
}

export async function getById(id) {
  const db = await getDB();
  return db
    .collection("projects")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "projectTags",
          localField: "_id",
          foreignField: "projectId",
          as: "projectTags",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "projectTags.tagId",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $addFields: {
          tag_ids: {
            $map: {
              input: "$tags._id",
              as: "tagId",
              in: { $toString: "$$tagId" },
            },
          },
        },
      },
    ])
    .toArray()
    .then((result) => result[0] || null);
}

export async function get() {
  const db = await getDB();
  return db
    .collection("projects")
    .aggregate([
      {
        $lookup: {
          from: "projectTags",
          let: { projectId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$projectId", "$$projectId"] } } },
            { $sort: { createdAt: 1 } },
          ],
          as: "projectTags",
        },
      },
      {
        $lookup: {
          from: "tags",
          let: { tagIds: "$projectTags.tagId" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$tagIds"] } } }],
          as: "tags",
        },
      },
      {
        $addFields: {
          tags: {
            $map: {
              input: "$projectTags",
              as: "pt",
              in: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$tags",
                      as: "t",
                      cond: { $eq: ["$$t._id", "$$pt.tagId"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          tag_ids: {
            $map: {
              input: "$tags",
              as: "t",
              in: { $toString: "$$t._id" },
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
}

export async function update(projectId, updateData, tag_ids) {
  const db = await getDB();

  await db
    .collection("projects")
    .updateOne({ _id: new ObjectId(projectId) }, { $set: updateData });

  if (tag_ids) {
    await db.collection("projectTags").deleteMany({
      projectId: new ObjectId(projectId),
    });

    if (tag_ids.length) {
      const projectTags = tag_ids.map((tagId) => ({
        projectId: new ObjectId(projectId),
        tagId: new ObjectId(tagId),
      }));

      const parsedData = projectTags.map((projectTag) =>
        ProjectTagSchema.parse(projectTag)
      );

      await db.collection("projectTags").insertMany(parsedData);
    }
  }
}

export async function remove(projectId) {
  const db = await getDB();

  await db.collection("projects").deleteOne({
    _id: new ObjectId(projectId),
  });

  await db.collection("projectTags").deleteMany({
    projectId: new ObjectId(projectId),
  });
}
