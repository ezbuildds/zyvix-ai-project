import dbConnection from "../config/database.js"
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
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Profile fetched successfully",
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Server error",
        })
    }
}