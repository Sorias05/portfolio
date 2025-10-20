import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

export async function create(experienceData) {
  const db = await getDB();
  return db.collection("experiences").insertOne(experienceData);
}

export async function getById(id) {
  const db = await getDB();
  return db.collection("experiences").findOne({ _id: new ObjectId(id) });
}

export async function get() {
  const db = await getDB();
  return db.collection("experiences").find().toArray();
}

export async function update(id, experienceData) {
  const db = await getDB();
  return db
    .collection("experiences")
    .updateOne({ _id: new ObjectId(id) }, { $set: experienceData });
}

export async function remove(id) {
  const db = await getDB();
  return db.collection("experiences").deleteOne({ _id: new ObjectId(id) });
}
