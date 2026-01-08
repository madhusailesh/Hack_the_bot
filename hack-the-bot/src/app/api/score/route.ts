import { client } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, regNo, totalTime } = await req.json();

    if (!name || !regNo || !totalTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const clientPromise = await client;
    const db = clientPromise.db("hackthebot");
    const leaderboard = db.collection("leaderboard");

    // Check agar user ka score pehle se hai
    const existingEntry = await leaderboard.findOne({ regNo });

    // Agar naya score better (kam time) hai, ya user naya hai, tabhi update karo
    if (!existingEntry || totalTime < existingEntry.totalTime) {
      await leaderboard.updateOne(
        { regNo },
        { $set: { name, regNo, totalTime, timestamp: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
}