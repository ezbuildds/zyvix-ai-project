import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config"
import dbConnection from "./config/database.js";
import signup from "./controller/signUp.js";
import verifyOtp from "./controller/verifySignupOtp.js";
import profile from "./controller/profile.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import login from "./controller/login.js";
import logout from "./controller/logout.js";
import forgot from "./controller/forgotPassword.js";
import verifySignupOtp from "./controller/verifySignupOtp.js";
import forgotPassword from "./controller/forgotPassword.js";
import verifyForgotOtp from "./controller/verifyForgotOtp.js";
import resetPassword from "./controller/resetPassword.js";
import resendOtp from "./controller/resendOtp.js";
const app = express()
// const PORT = process.env.PORT || 3000
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    // origin: "http://192.168.2.101:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))
app.get("/", async (req, res) => {
    const db = await dbConnection()
    const data = await db.collection("users").find().toArray()
    res.send(data)
})
// app.post("/api/users/signup", signup)
// app.post("/api/users/verify-otp", verifyOtp)
// app.post("/api/users/login", login)
// app.post("/api/users/logout", logout)
// app.post("/api/users/forgot", forgot)
// app.get("/api/users/profile", authMiddleware, profile)
app.post("/api/auth/signup", signup)
app.post("/api/auth/signup/verify-otp", verifySignupOtp)
app.post("/api/auth/signup/resend-otp", resendOtp)

app.post("/api/auth/login", login)
app.post("/api/auth/logout", logout)

app.post("/api/auth/password/forgot", forgotPassword)
app.post("/api/auth/password/verify-otp", verifyForgotOtp)
app.post("/api/auth/password/reset", resetPassword)

app.get("/api/users/profile", authMiddleware, profile)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})