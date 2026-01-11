import {scores} from "@/src/lib/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    
    const scoreRecord = await scores
      .find({})
      .sort({ totalTime: 1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ scoreRecord },{status:200});
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ scores: [] },{status:error.status || 500});
  }
}
