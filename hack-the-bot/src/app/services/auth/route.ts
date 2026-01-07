import {client} from "@/lib/db";
import {NextRequest,NextResponse} from "next/server";

interface User{
    name:string,
    regd_no:number
};

export async function POST(req:NextRequest){
    const {name,regd_no} : User = await req.json();
    if(!name || !regd_no){
        return NextResponse.json({status:400,message:"All the credentials are required."});
    }
    try{
        const clientPromise = await client;
        const db = clientPromise.db("hackthebot");
        const users = db.collection("users");
        const user = await users.findOne({regd_no:regd_no});
        if(user){
            return NextResponse.json({status:401,message:"Credential exists"});
        }
        const response = await users.insertOne({name:name,regd_no:regd_no});
        return NextResponse.json({status:200,message:"Successful registration"});
    }catch(Err:any){
        console.error(Err);
        return NextResponse.json({status:Err.status,error:Err.message});
    }
}
