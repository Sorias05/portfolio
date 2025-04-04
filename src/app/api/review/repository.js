import { getDB } from "@/app/api/mongodb";
import { ObjectId } from "mongodb";

export async function create(reviewData) {
  const db = await getDB();
  return db.collection("reviews").insertOne(reviewData);
}

export async function getById(id) {
  const db = await getDB();
  return db.collection("reviews").findOne({ _id: new ObjectId(id) });
}

export async function getByUser(userId) {
  const db = await getDB();
  return db
    .collection("reviews")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function get() {
  const db = await getDB();
  return db
    .collection("reviews")
    .aggregate([
      {
        $addFields: { userId: { $toObjectId: "$userId" } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user.password": 0,
          "user._id": 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
    .toArray();
}

export async function getChosen() {
  const db = await getDB();
  return db
    .collection("reviews")
    .aggregate([
      {
        $addFields: { userId: { $toObjectId: "$userId" } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user.password": 0,
          "user._id": 0,
        },
      },
      {
        $match: { chosen: true },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
    .toArray();
}

export async function update(id, reviewData) {
  const db = await getDB();
  return db
    .collection("reviews")
    .updateOne({ _id: new ObjectId(id) }, { $set: reviewData });
}

export async function remove(id) {
  const db = await getDB();
  return db.collection("reviews").deleteOne({ _id: new ObjectId(id) });
}

export async function removeByUser(userId, session) {
  const db = await getDB();
  return db
    .collection("reviews")
    .deleteMany({ userId: new ObjectId(userId) }, { session });
}
