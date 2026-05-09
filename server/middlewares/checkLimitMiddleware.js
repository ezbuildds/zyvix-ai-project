
import { ObjectId } from "mongodb";
import dbConnection from "../config/database.js";
import { PLAN_LIMITS } from "../services/plan/planLimit.js";

export async function checkLimitMiddleware(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized access" });
        }
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log("Limit Middleware :", decodedUser);
        const db = await dbConnection();
        const users = db.collection("users");
        const user = await users.findOne({ _id: new ObjectId(decodedUser._id) });

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found." });
        }

        const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
        const currentCount = user?.freeLimit || 0;

        if (currentCount >= limit) {
            return res.status(429).send({
                success: false,
                message: `Free limit exhausted. Upgrade to premium for more generations.`,
                limit,
                used: currentCount,
                plan: user.plan,
            });
        }
        await users.updateOne(
            { _id: user._id },
            { $inc: { "freeLimit": 1 } }
        );

        req.user = { ...user, remaining: limit - currentCount - 1 };
        next();

    } catch (error) {
        console.error("Limit check error:", error.message);
        return res.status(500).send({ success: false, message: "Server error." });
    }
}