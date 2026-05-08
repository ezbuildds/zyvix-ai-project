import "dotenv/config"
import dbConnection from "../config/database.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb";
export default async function resetPassword(req, res) {
    try {
        const token = req.cookies.forgotTemp_token
        const { confirmPassword } = req.body
        const decodeUser = jwt.verify(token, process.env.SECRET_KEY)
        const dataBase = await dbConnection()
        const user = await dataBase.collection('users').findOne({ _id: new ObjectId(decodeUser.userId) })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "invalid credentials"
            })
        }
        const hashPassword = await bcrypt.hash(confirmPassword, 10)
        await dataBase.collection("users").updateOne({ _id: user._id }, { $set: { password: hashPassword } })
        res.clearCookie("forgotTemp_token")
        return res.status(200).send({
            success: true,
            message: "Reset success",
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: "Unauthorized request"
        })
    }
}