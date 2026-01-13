import { NextResponse } from "next/server";
import {scores, scoreSheetOutbox} from "@/src/lib/schema";
import clientPromise from "@/src/lib/db";

export async function POST(req: Request) {
  const client = await clientPromise;
  const session = client.startSession();
  try {
    const body = await req.json();

    await session.withTransaction(async ()=>{
      const result = await scores.insertOne({
        name:body.name,
        regNo:body.regNo,
        userId:body.userId,
        totalTime:body.totalTime,
        totalGueses:body.totalGueses,
        timestamp:new Date()
      },{session});

      await scoreSheetOutbox.insertOne({
        type:"SCORE_INSERTED",
        scoreId:result.insertedId,
        processed:false,
        createdAt:new Date()
      },{session});
    });

    return NextResponse.json({ message: "Score Saved And Queued for spreadsheet sync." },{status:200});

  } catch (e:any) {
    console.error("Score Save Error:", e);
    return NextResponse.json({ error: "Failed to save score" }, { status: e.status || 500 });
  }finally{
    await session.endSession();
  }
}
