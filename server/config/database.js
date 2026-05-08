import { MongoClient } from "mongodb"
import "dotenv/config"
export default async function dbConnection() {
    const dbName = "zyvix"
    const url = process.env.MONGODB_URL
    const client = new MongoClient(url)
    const connection = await client.connect()
    const db = await connection.db(dbName)
    return db
}
