// import { MongoClient } from "mongodb"
// import "dotenv/config"
// export default async function dbConnection() {
//     const dbName = "zyvix"
//     const url = process.env.MONGODB_URL
//     const client = new MongoClient(url)
//     const connection = await client.connect()
//     const db = connection.db(dbName)
//     console.log(`Mongodb connected  ✅🎉`)
//     return db
// }
import { MongoClient } from "mongodb";
import "dotenv/config";
const dbName = "zyvix";
const url = process.env.MONGODB_URL;
let client;
let db;
export default async function dbConnection() {
    try {
        // Existing connection reuse
        if (db) return db;
        client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log("Mongodb connected ✅🎉");
        return db;
    } catch (error) {
        console.log(error.message);
    }
}
