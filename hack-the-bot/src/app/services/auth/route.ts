import clientPromise from "@/lib/db";  
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, regd_no } = await req.json();

        // 1. Basic Validation
        if (!name || !regd_no) {
            return NextResponse.json({ status: 400, message: "All credentials are required." });
        }

        // 2. CHECK: Agar DB Offline hai (No Connection)
        // Ye bohot zaroori hai taki tumhara game crash na ho bina MongoDB ke
        if (!clientPromise) {
            console.log(`⚠️ Mock Registration for: ${name} (${regd_no})`);
            return NextResponse.json({ 
                status: 200, 
                message: "Successful registration (Offline Mode)" 
            });
        }

        // 3. Agar DB Online hai (Real Logic)
        const client = await clientPromise;
        const db = client.db("hackthebot");
        const users = db.collection("users");

        const user = await users.findOne({ regd_no: regd_no });

        if (user) {
            // Agar user pehle se hai, toh bhi game khelne do (optional logic change)
            // Filhal tumhare logic ke hisab se error return kar rahe hain:
            return NextResponse.json({ status: 401, message: "Credential exists" });
        }

        await users.insertOne({ name: name, regd_no: regd_no });
        return NextResponse.json({ status: 200, message: "Successful registration" });

    } catch (Err: any) {
        console.error("Registration Error:", Err);
        return NextResponse.json({ 
            status: 500, 
            error: Err.message || "Internal Server Error" 
        });
    }
}
