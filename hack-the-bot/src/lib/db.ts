// src/lib/db.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {};

if (process.env.NODE_ENV === "development") {
  // Dev mode: global cache (hot reload safe)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: NEW connection per cold start (Vercel friendly)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
