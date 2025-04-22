import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

export async function create(userData) {
  const db = await getDB();
  return db.collection("users").insertOne(userData);
}

export async function get() {
  const db = await getDB();
  return db.collection("users").find().toArray();
}

export async function getById(id) {
  const db = await getDB();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}

export async function getByEmail(email) {
  const db = await getDB();
  return db.collection("users").findOne({ email });
}

export async function update(id, userData) {
  const db = await getDB();
  return db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: userData });
}

export async function remove(id, session) {
  const db = await getDB();
  return db.collection("users").deleteOne({ _id: new ObjectId(id) }, { session });
}
