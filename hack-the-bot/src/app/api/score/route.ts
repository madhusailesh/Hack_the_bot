// src/lib/db.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | null = null;

if (!uri) {
  // Yahan hum Error THROW NAHI kar rahe, bas warning de rahe hain
  console.warn("⚠️ MONGODB_URI is missing. Running in Offline Mode.");
} else {
  const options = {};
  
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
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

// Ye ab null return karega agar URI nahi hai -> Build Pass ho jayega
export default clientPromise;