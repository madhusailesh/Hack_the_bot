import clientPromise from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/src/lib/schema";

export const dynamic = "force-dynamic";

interface User {
  name: string;
  regd_no: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {name,regd_no}=body as User;

    const uId: string = "User" + Math.floor(Math.random() * 100000).toString();

    // 1. Basic Validation
    if (!name || !regd_no) {
      return NextResponse.json(
        { error: "All credentials are required." },
        { status: 400 }
      );
    }
    const user = await users.findOne({ regd_no: regd_no });

    if (user) {
      return NextResponse.json(
        { message: "Credential exists" },
        { status: 409 }
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
