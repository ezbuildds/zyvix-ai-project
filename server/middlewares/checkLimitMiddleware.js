
import { ObjectId } from "mongodb";
import dbConnection from "../config/database.js";
import { PLAN_LIMITS } from "../services/plan/planLimit.js";
import jwt from "jsonwebtoken"

export default async function checkLimitMiddleware(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized access" });
        }
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        const db = await dbConnection();
        const users = db.collection("users");
        const user = await users.findOne({ _id: new ObjectId(decodedUser.userId) });

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found." });
        }

        const limit = PLAN_LIMITS[user.plan].credits || PLAN_LIMITS.Free;
        const currentCount = user?.usedCredits || 0;

        if (currentCount >= limit) {
            return res.status(429).send({
                success: false,
                message: `Upgrade to premium for more generations.`,
                limit,
                used: currentCount,
                plan: user.plan,
            });
        }
        await users.updateOne(
            { _id: user._id },
            { $inc: { "usedCredits": 1 } }
        );
        const remaining = Math.max(0, limit - currentCount-1)
        req.remainingCredits = { remaining: remaining }
        next();

    } catch (error) {
        console.error("Limit check error:", error.message);
        return res.status(500).send({ success: false, message: "Server error." });
    }
}