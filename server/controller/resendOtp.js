import dbConnection from "../config/database.js";
import crypto from "crypto";
import verificationEmail from "../services/email/verificationEmail.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function Resend(req, res) {
    try {
        const { type } = req.body;
        let token;
        let dbCollection;
        if (type === "signup") {
            token = req.cookies.signupTemp_token;
            dbCollection = "signupOtps";
        }
        if (type === "forgot") {
            token = req.cookies.forgotTemp_token;
            dbCollection = "forgotOtps";
        }
        console.log("Resend Token :", token);
        if (!token) {
            return res.status(400).send({
                success: false,
                message: "Unauthorized request"
            });
        }
        const db = await dbConnection();
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "user not found"
            });
        }
        // const otpRecord = await db.collection("signupOtps").findOne({ userId: user._id });
        const otpRecord = await db.collection(dbCollection).findOne({ userId: user._id });
        const now = new Date();
        if (otpRecord?.createdAt) {
            const diff = now - new Date(otpRecord.createdAt).getTime();
            if (diff < 20 * 1000) {
                const remaining = Math.ceil((20 * 1000 - diff) / 1000);
                return res.status(429).send({
                    success: false,
                    message: `Please wait ${remaining}s before requesting again`,
                    countDown: remaining
                });
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHmac("sha256", process.env.OTPHASH_SECRET_KEY).update(otp).digest("hex");
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await db.collection(dbCollection).updateOne(
            { userId: user._id },
            {
                $set: {
                    userId: user._id,
                    otp: hashedOtp,
                    expiresAt: otpExpiry,
                    createdAt: now
                }
            },
            { upsert: true }
        );
        await verificationEmail(otp, user.email);
        return res.status(200).send({
            success: true,
            message: "OTP resent successfully",
            lastOtpSent: now
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}