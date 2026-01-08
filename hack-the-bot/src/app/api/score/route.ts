import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

// Note: "export default" use mat karna, "export async function" use karo
export async function POST(req: Request) {
  try {
    const body = await req.json();
     
    if (!clientPromise) {
      console.log("⚠️ Offline Mode: Score received but not saved to DB:", body);
      return NextResponse.json({ message: "Score processed (Offline Mode)" });
    }

    // 2. Real DB Logic
    const client = await clientPromise;
    const db = client.db("hackthebot"); // Apna DB naam check kar lena
    
    // Score save karna
    await db.collection("scores").insertOne({
      name: body.name,
      regNo: body.regNo,
      totalTime: body.totalTime,
      timestamp: new Date()
    });

    return NextResponse.json({ message: "Score Saved Successfully!" });

  } catch (e) {
    console.error("Score Save Error:", e);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}