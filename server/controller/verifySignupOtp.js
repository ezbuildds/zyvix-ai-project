import dbConnection from "../config/database.js";
import jwt from "jsonwebtoken"
import "dotenv/config"
import crypto from "crypto"
import { ObjectId } from "mongodb";

export default async function verifySignupOtp(req, res) {
    try {
        const userToken = req.cookies.signupTemp_token
        const { otp } = req.body
        if (!userToken) {
            return res.status(401).send({
                success: false,
                message: "Token missing"
            })
        }
        if (!otp) {
            return res.status(400).send({
                success: false,
                message: "OTP required"
            })
        }
        console.log("OTP_verifyToken :", userToken);
        try {
            const decodeUser = jwt.verify(userToken, process.env.SECRET_KEY)
            const dataBase = await dbConnection()
            const user = await dataBase.collection('users').findOne({ _id: new ObjectId(decodeUser.userId) })
            if (!user) {
                return res.status(400).send({
                    success: false,
                    message: "invalid user"
                })
            }
            const userInputHash = crypto.createHmac("sha256", process.env.OTPHASH_SECRET_KEY).update(otp).digest("hex")
            const otpData = await dataBase.collection("signupOtps").findOne({ userId: user._id })
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
            await dataBase.collection("users").updateOne({ _id: user._id }, { $set: { isVerified: true } })
            await dataBase.collection("signupOtps").deleteOne({ userId: user._id })

            res.clearCookie("signupTemp_token")
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1d" })
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.status(200).send({
                success: true,
                message: "OTP verify success",
                data: user
            })
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: "Invalid or expired token"
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "internal server error"
        })
    }




}