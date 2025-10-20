import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

export async function create(projectTagData) {
  const db = await getDB();
  return db.collection("projectTags").insertOne(projectTagData);
}

export async function getById(id) {
  const db = await getDB();
  return db.collection("projectTags").findOne({ _id: new ObjectId(id) });
}

export async function get() {
  const db = await getDB();
  return db
    .collection("projectTags")
    .aggregate([
      {
        $addFields: { projectId: { $toObjectId: "$projectId" } },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $projectTag: {
          "project.password": 0,
          "project._id": 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
    .toArray();
}

export async function update(id, projectTagData) {
  const db = await getDB();
  return db
    .collection("projectTags")
    .updateOne({ _id: new ObjectId(id) }, { $set: projectTagData });
}

export async function remove(id) {
  const db = await getDB();
  return db.collection("projectTags").deleteOne({ _id: new ObjectId(id) });
}
