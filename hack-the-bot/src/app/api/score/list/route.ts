import { client } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientPromise = await client;
    const db = clientPromise.db("hackthebot");
    
    // Fetch top 10 sorted by totalTime (ascending -> kam time wala winner)
    const scores = await db.collection("leaderboard")
      .find({})
      .sort({ totalTime: 1 }) 
      .limit(10)
      .toArray();

    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json({ scores: [] });
  }
}