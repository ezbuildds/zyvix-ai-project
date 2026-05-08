import dbConnection from "../config/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

export default async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            })
        }
        const dataBase = await dbConnection()
        const user = await dataBase.collection("users").findOne({ email: email.toLowerCase() })
        if (!user || !user.isVerified) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials"
            })
        }
        const isCompare = await bcrypt.compare(password, user.password)
        if (!isCompare) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(200).send({
            success: true,
            message: "Login success",
            data: user
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}