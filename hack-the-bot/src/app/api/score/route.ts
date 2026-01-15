import { NextResponse } from "next/server";
import { scores, scoreSheetOutbox } from "@/src/lib/schema";
import clientPromise from "@/src/lib/db";

export async function POST(req: Request) {
  const client = await clientPromise;
  const session = client.startSession();
  try {
    const body = await req.json();

    await session.withTransaction(async () => {
      const result = await scores.findOneAndUpdate(
        { regNo: body.regNo },
        {
          $set: {
            name: body.name,
            userId: body.userId,
            totalTime: body.totalTime,
            totalGueses: body.totalGueses,
            level: body.level, // Total levels played
            levelsWon: body.levelsWon, // NEW: Levels actually won
            timestamp: new Date()
          }
        },
        { 
          session, 
          upsert: true,
          returnDocument: "after"
        }
      );

      const savedScore = result.value || result;

      if (savedScore && savedScore._id) {
        await scoreSheetOutbox.insertOne({
          type: "SCORE_INSERTED",
          scoreId: savedScore._id,
          processed: false,
          createdAt: new Date()
        }, { session });
      }
    });

    return NextResponse.json({ message: "Score Saved" }, { status: 200 });

  } catch (e: any) {
    console.error("Score Save Error:", e);
    return NextResponse.json({ error: "Failed to save score" }, { status: e.status || 500 });
  } finally {
    await session.endSession();
  }
}