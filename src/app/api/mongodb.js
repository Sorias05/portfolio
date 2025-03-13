import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let dbConnect;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  dbConnect = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  dbConnect = client.connect();
}

export async function getDB() {
  const client = await dbConnect;
  return client.db();
}

export default dbConnect;
