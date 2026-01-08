import clientPromise from "@/lib/db"; // Note: Curly braces {} hata diye hain kyunki default export hai
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Agar DB connection nahi hai (Local/Offline Mode)
  if (!clientPromise) {
    console.log("Serving Mock Leaderboard Data");
    return NextResponse.json({
      scores: [
        { name: "Pro Player", regNo: 220101, totalTime: 150 }, // Fake Data 1
        { name: "Speedster", regNo: 220102, totalTime: 180 },  // Fake Data 2
        { name: "No DB User", regNo: 220103, totalTime: 200 }, // Fake Data 3
      ],
    });
  }

  try {
    // 2. Agar DB connected hai (Real Mode)
    const client = await clientPromise;
    const db = client.db("hackthebot"); // Database ka naam verify kar lena
    
    // Fetch top 10 sorted by totalTime (ascending -> kam time wala winner)
    // Note: Collection ka naam 'scores' rakha tha pichle POST route mein, 
    // agar wahan 'scores' hai toh yahan bhi 'scores' hi use karna.
    const scores = await db.collection("scores") 
      .find({})
      .sort({ totalTime: 1 }) 
      .limit(10)
      .toArray();

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ scores: [] });
  }
}