import clientPromise from "@/src/lib/db";
import {Collection} from "mongodb";

const connection = await clientPromise;

if(!connection){
    throw new Error("MongoDb disabled");
}

const db = connection.db("hackthebot");

declare global{
    var mongoUser : undefined | Collection;
}

if(!(global.mongoUser)){
    const collection : Collection   = await db.collection("users");
    await collection.createIndex({regd_no:1},{unique:true});
    global.mongoUser= collection;
}

export const users = global.mongoUser;
