import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config"
import dbConnection from "./config/database.js";
import signup from "./controller/signUp.js";
import profile from "./controller/profile.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import login from "./controller/login.js";
import logout from "./controller/logout.js";
import verifySignupOtp from "./controller/verifySignupOtp.js";
import forgotPassword from "./controller/forgotPassword.js";
import verifyForgotOtp from "./controller/verifyForgotOtp.js";
import resetPassword from "./controller/resetPassword.js";
import resendOtp from "./controller/resendOtp.js";
import article from "./services/aiService/article.js";
import checkLimitMiddleware from "./middlewares/checkLimitMiddleware.js";
import dashboard from "./controller/dashboard.js";
import title from "./services/aiService/title.js";
import image from "./services/aiService/image.js";
import removeBg from "./services/aiService/removeBg.js";
import multer from "multer";
import chekoutSession from "./services/payments/chekoutSession.js";
import verifyPayment from "./services/payments/verifyPayment.js";
const upload = multer({ storage: multer.memoryStorage() });
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    // origin: "http://localhost:5173",
    origin: "http://192.168.1.19:5173",
    credentials: true
}))
app.use(cookieParser())
app.post("/api/payment/webhook",
    express.raw({ type: "application/json" }),
    verifyPayment,
)
app.use(morgan("dev"))
app.use(express.json())
app.get("/", async (req, res) => {
    const db = await dbConnection()
    const data = await db.collection("users").find().toArray()
    res.send(data)
})

app.post("/api/auth/signup", signup)
app.post("/api/auth/signup/verify-otp", verifySignupOtp)
app.post("/api/auth/signup/resend-otp", resendOtp)

app.post("/api/auth/login", login)
app.post("/api/auth/logout", logout)

app.post("/api/auth/password/forgot", forgotPassword)
app.post("/api/auth/password/verify-otp", verifyForgotOtp)
app.post("/api/auth/password/reset", resetPassword)

app.get("/api/users/profile", authMiddleware, profile)

// #Services Api
app.get("/api/dashboard", dashboard)
app.post("/api/generate-article", checkLimitMiddleware, article)
app.post("/api/generate-title", checkLimitMiddleware, title)
app.post("/api/generate-image", checkLimitMiddleware, image)
app.post("/api/remove-image-bg", checkLimitMiddleware, upload.single("image_file"), removeBg)

// Payment Api
app.post("/api/payment/chekout", chekoutSession)

await dbConnection();
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} ✅🎉`)
})























