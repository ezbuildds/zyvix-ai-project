import jwt from "jsonwebtoken"
import "dotenv/config"
export default async function authMiddleware(req, res, next) {
    const token = req.cookies.token
    console.log("User token : ", token);
    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decodedUser);
            req.user = decodedUser
            next()

    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Invalid token"
        })
    }
}
