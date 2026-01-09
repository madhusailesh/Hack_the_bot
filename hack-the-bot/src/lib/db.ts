// src/lib/db.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | null = null;

if (!uri) {
  // Agar URI nahi hai, toh bas warning do, error nahi
  console.warn("⚠️ MONGODB_URI is missing. Database features will be disabled.");
} else {
  // Agar URI hai, toh connect karo
  const options = {};
  
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Important: Ab ye null bhi return kar sakta hai
export default clientPromise;
