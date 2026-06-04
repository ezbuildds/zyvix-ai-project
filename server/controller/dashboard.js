import "dotenv/config"
import dbConnection from "../config/database.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export default async function dashboard(req, res) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unothorized access"
        });
    }
    try {
        const db = await dbConnection();
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decodedUser.userId) });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: " User not found"
            });
        }
        const history = await db.collection("generationHistory").find({ userId: user._id }).toArray()

        return res.status(200).send({
            success: true,
            message: "History fetched successfully",
            data: history
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }

}