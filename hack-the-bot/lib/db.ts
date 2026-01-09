import {MongoClient} from "mongodb";

declare global{
    var mongoClient : Promise<MongoClient> | undefined;
};

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"; 

if(!(global.mongoClient)){
    const conn = new MongoClient(uri);
    global.mongoClient = conn.connect();
}

const client : Promise<MongoClient> = global.mongoClient;

export {client};