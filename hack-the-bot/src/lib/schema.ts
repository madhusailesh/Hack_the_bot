import clientPromise from "@/src/lib/db";
import {Collection} from "mongodb";

const connection = await clientPromise;

if(!connection){
    throw new Error("MongoDb disabled");
}

const db = connection.db("hackthebot");

declare global{
    var mongoUser : undefined | Collection;
    var scores:undefined | Collection;
    var scoreSheetOutbox:undefined | Collection;
}

if(!(global.mongoUser)){
    const collection : Collection   = await db.collection("users");
    await collection.createIndex({regd_no:1},{unique:true});
    global.mongoUser= collection;
}

if(!(global.scores)){
    const scoreCollection : Collection = await db.collection("scores");
    await scoreCollection.createIndex({regNo:1},{unique:true});
    global.scores=scoreCollection;
}

if(!(global.scoreSheetOutbox)){
    const scoreSheetOutboxCollection : Collection = await db.collection("scoreSheetOutbox");
    await scoreSheetOutboxCollection.createIndex({processed:1,createdAt:1});
    global.scoreSheetOutbox = scoreSheetOutboxCollection;
}

const scores = global.scores;

const users = global.mongoUser;

const scoreSheetOutbox = global.scoreSheetOutbox;

export {users,scores,scoreSheetOutbox};
