import "dotenv/config"
import dbConnection from "../config/database.js";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import crypto from "crypto"
export default async function verifyForgotOtp(req, res) {
    try {
        const token = req.cookies.forgotTemp_token
        const { otp } = req.body
        console.log("OTP_verifyToken :", token);
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized request"
            })
        }
        const decodeUser = jwt.verify(token, process.env.SECRET_KEY)
        const dataBase = await dbConnection()
        const user = await dataBase.collection('users').findOne({ _id: new ObjectId(decodeUser.userId) })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "invalid credentials"
            })
        }
        const userInputHash = crypto.createHmac("sha256", process.env.OTPHASH_SECRET_KEY).update(otp).digest("hex")
        const otpData = await dataBase.collection("forgotOtps").findOne({ userId: user._id })
        if (!otpData || otpData.otp !== userInputHash) {
            return res.status(400).send({
                success: false,
                message: "Invalid otp"
            })
        }
        if (new Date() > otpData.expiresAt) {
            return res.status(400).send({
                success: false,
                message: "OTP Expired"
            })
        }
        await dataBase.collection("forgotOtps").deleteOne({ userId: user._id })
        return res.status(200).send({
            success: true,
            message: "Reset verify success",
            data: user
        })
    } catch (error) {

    }
}