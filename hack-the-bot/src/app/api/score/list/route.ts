import { scores } from "@/src/lib/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    
    // Sorting logic change kiya hai:
    // 1. level: -1 (Highest level first)
    // 2. totalTime: 1 (Lowest time for that level is better)
    // 3. totalGueses: 1 (Lowest guesses is better)
    const scoreRecord = await scores
      .find({})
      .sort({ level: -1, totalTime: 1, totalGueses: 1 }) 
      .limit(10)
      .toArray();

      if(!scoreRecord){
        return NextResponse.json({scores:[]},{status:400});
      }

    return NextResponse.json({ scores:scoreRecord },{status:200});
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ scores: [] },{status:error.status || 500});
  }
}