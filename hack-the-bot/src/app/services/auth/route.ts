import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { name, regd_no } = await req.json();

    const uId: string = "User" + Math.floor(Math.random() * 100000).toString();

    // 1. Basic Validation
    if (!name || !regd_no) {
      return NextResponse.json(
        { error: "All credentials are required." },
        { status: 400 }
      );
    }

    // 2. CHECK: Agar DB Offline hai (No Connection)
    // Ye bohot zaroori hai taki tumhara game crash na ho bina MongoDB ke
    if (!clientPromise) {
      console.log(`⚠️ Mock Registration for: ${name} (${regd_no})`);
      return NextResponse.json(
        { message: "Successful registration (Offline Mode)" },
        {
          status: 200,
        }
      );
    }

    // 3. Agar DB Online hai (Real Logic)
    const user = await users.findOne({ regd_no: regd_no });

    if (user) {
      // Agar user pehle se hai, toh bhi game khelne do (optional logic change)
      // Filhal tumhare logic ke hisab se error return kar rahe hain:
      return NextResponse.json(
        { message: "Credential exists" },
        { status: 401 }
      );
    }

    await users.insertOne({ name: name, regd_no: regd_no, uId: uId });
    return NextResponse.json(
      {
        message: "Successful registration",
        uId: uId,
      },
      {
        status: 200,
      }
    );
  } catch (Err: any) {
    console.error("Registration Error:", Err);
    return NextResponse.json(
      { error: Err.message || "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
