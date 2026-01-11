import clientPromise from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface User {
  name: string;
  regd_no: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, regd_no } = body as User;

    // 1️⃣ Basic validation
    if (!name || !regd_no) {
      return NextResponse.json(
        { message: "All credentials are required." },
        { status: 400 }
      );
    }

    // 2️⃣ Connect DB (runtime only)
    const client = await clientPromise;
    const db = client.db("hack_the_bot"); 
    const users = db.collection<User>("users");

    // 3️⃣ Check existing user
    const existingUser = await users.findOne({ regd_no });

    if (existingUser) {
      return NextResponse.json(
        { message: "Credential already exists" },
        { status: 409 }
      );
    }

    // 4️⃣ Insert new user
    await users.insertOne({ name, regd_no });

    return NextResponse.json(
      { message: "Successful registration" },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
