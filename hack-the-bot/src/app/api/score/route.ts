import { NextResponse } from "next/server";
import { scores, scoreSheetOutbox } from "@/src/lib/schema";
import clientPromise from "@/src/lib/db";

export async function POST(req: Request) {
  const client = await clientPromise;
  const session = client.startSession();
  try {
    const body = await req.json();

    await session.withTransaction(async () => {
      // 'insertOne' ki jagah 'findOneAndUpdate' use kiya hai with upsert: true
      // Isse duplicate key error nahi aayega, balki existing record update ho jayega
      const result = await scores.findOneAndUpdate(
        { regNo: body.regNo }, // Check karega ki is RegNo ka user hai ya nahi
        {
          $set: {
            name: body.name,
            userId: body.userId,
            totalTime: body.totalTime,
            totalGueses: body.totalGueses,
            level: body.level,
            timestamp: new Date()
          }
        },
        { 
          session, 
          upsert: true, // Agar nahi mila to naya bana dega
          returnDocument: "after" // Update ke baad naya document return karega
        }
      );

      // MongoDB driver version ke hisab se result kabhi direct doc hota hai, kabhi result.value
      const savedScore = result.value || result;

      if (savedScore && savedScore._id) {
        await scoreSheetOutbox.insertOne({
          type: "SCORE_INSERTED", // Worker ko sync karne ke liye signal
          scoreId: savedScore._id,
          processed: false,
          createdAt: new Date()
        }, { session });
      }
    });

    return NextResponse.json({ message: "Score Saved And Queued for spreadsheet sync." }, { status: 200 });

  } catch (e: any) {
    console.error("Score Save Error:", e);
    // Duplicate key error ab handle ho gaya hai, par generic error handling rakhi hai
    return NextResponse.json({ error: "Failed to save score" }, { status: e.status || 500 });
  } finally {
    await session.endSession();
  }
}