import dbConnection from "../config/database.js"
import verificationEmail from "../services/email/verificationEmail.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import "dotenv/config"
export default async function forgotPassword(req, res) {
    const { email } = req.body
    try {
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email required"
            })
        }
        const dataBase = await dbConnection()
        const collection = dataBase.collection("users")
        const user = await collection.findOne({ email: email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials"
            })
        }

        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOtp = crypto.createHmac("sha256", process.env.OTPHASH_SECRET_KEY).update(resetOtp).digest("hex")
        const resetExpiry = new Date(Date.now() + 5 * 60 * 1000)

        await dataBase.collection("forgotOtps").updateOne({ userId: user._id }, { $set: { userId: user._id, otp: hashedOtp, expiresAt: resetExpiry, createdAt: new Date() } }, { upsert: true })
        await verificationEmail(resetOtp, email)
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "20m" })
        res.cookie("forgotTemp_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 20 * 60 * 1000
        })
        return res.status(200).send({
            success: true,
            message: "Reset otp send"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }

}