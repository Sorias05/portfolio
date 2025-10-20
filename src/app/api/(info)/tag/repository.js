import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

export async function create(tagData) {
  const db = await getDB();
  return db.collection("tags").insertOne(tagData);
}

export async function getById(id) {
  const db = await getDB();
  return db.collection("tags").findOne({ _id: new ObjectId(id) });
}

export async function get() {
  const db = await getDB();
  return db.collection("tags").find().toArray();
}

export async function update(id, tagData) {
  const db = await getDB();
  return db
    .collection("tags")
    .updateOne({ _id: new ObjectId(id) }, { $set: tagData });
}

export async function remove(tagId) {
  const db = await getDB();

  await db.collection("tags").deleteOne({
    _id: new ObjectId(tagId),
  });

  await db.collection("projectTags").deleteMany({
    tagId: new ObjectId(tagId),
  });
}
