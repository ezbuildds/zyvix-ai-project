import dbConnection from "../config/database.js"
import { PLAN_LIMITS } from "../services/plan/planLimit.js"
export default async function profile(req, res) {
    try {
        const userFromToken = req.user
        if (!userFromToken) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized"
            })
        }
        const dataBase = await dbConnection()
        const user = await dataBase.collection("users").findOne({ email: userFromToken.email }, { projection: { password: 0 } })
        const limit = PLAN_LIMITS[user.plan].credits || PLAN_LIMITS.Free;

        const currentCount = user?.usedCredits || 0;
        const remaining = Math.max(0, limit - currentCount)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Profile fetched successfully",
            data: { ...user, remainingLimit: remaining, totalLimit: PLAN_LIMITS[user.plan].credits }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Server error",
        })
    }
}