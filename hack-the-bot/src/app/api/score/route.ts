import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check: Agar DB connection nahi hai (null hai)
    if (!clientPromise) {
      console.log("Mock Saving Score (No DB):", body);
      return NextResponse.json({ message: "DB disabled, score skipped" });
    }

    // Agar DB hai, toh normal save karo
    const client = await clientPromise;
    const db = client.db("gameDB");
    await db.collection("scores").insertOne(body);

    return NextResponse.json({ message: "Score Saved!" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}