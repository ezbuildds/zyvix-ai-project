import dbConnection from "../config/database.js"
import bcrypt from "bcrypt"
import verificationEmail from "../services/email/verificationEmail.js"
import "dotenv/config"
import crypto from "crypto"
import jwt from "jsonwebtoken"
export default async function signup(req, res) {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "All field required"
            })
        }
        const db = await dbConnection()
        const user = await db.collection("users").findOne({ email })
        if (user) {
            return res.status(400).send({
                success: false,
                message: "user already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const otp = Math.ceil(100000 + Math.random() * 900000).toString()
        const hashedOtp = crypto.createHmac("sha256", process.env.OTPHASH_SECRET_KEY).update(otp).digest("hex")
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        const createUser = await db.collection("users").insertOne({ username, email, plan: "free", password: hashPassword, isVerified: false, usedCredits: 0, createAt: new Date() })
        const userId = createUser.insertedId
        await db.collection("signupOtps").updateOne({ userId: userId }, { $set: { userId: userId, otp: hashedOtp, expiresAt: otpExpiry, createdAt: new Date() } }, { upsert: true })

        const tempVerifyToken = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: "20m" })
        res.cookie("signupTemp_token", tempVerifyToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 20 * 60 * 1000
        })
        verificationEmail(otp, email)
        return res.status(201).send({
            success: true,
            message: "OTP send",
            email
        })
    } catch (error) {
        console.log("Sign up error :", error.message)
        return res.status(500).send({
            success: false,
            message: "Server error"
        })

    }


} 