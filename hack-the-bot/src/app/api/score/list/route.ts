import clientPromise from "@/src/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  // Agar DB connected nahi hai (Offline Mode)
  if (!clientPromise) {
    return NextResponse.json({
      scores: [
        { name: "Demo User 1", regNo: 123, totalTime: 120 },
        { name: "Demo User 2", regNo: 456, totalTime: 140 },
      ],
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("hackthebot");
    
    const scores = await db.collection("scores")
      .find({})
      .sort({ totalTime: 1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json({ scores: [] });
  }
}