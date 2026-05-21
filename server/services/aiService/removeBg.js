import "dotenv/config";
import jwt from "jsonwebtoken";
import dbConnection from "../../config/database.js";
import { ObjectId } from "mongodb";
export default async function removeBg(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized access"
            });
        }
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Image file is required"
            });
        }
        console.log("RemoveBg - File received:", req.file.originalname, req.file.mimetype);
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).send({
                success: false,
                message: "Only PNG, JPG, or WEBP images are allowed"
            });
        }
        const form = new FormData();
        const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        form.append("image_file", imageBlob, req.file.originalname);

        const clipdropRes = await fetch("https://clipdrop-api.co/remove-background/v1", {
            method: "POST",
            headers: {
                "x-api-key": process.env.CLIPDROP_API_KEY,
            },
            body: form,
        });
        console.log("ClipDrop Status:", clipdropRes.status);
        const buffer = await clipdropRes.arrayBuffer();
        const contentType = clipdropRes.headers.get("content-type");

        if (!clipdropRes.ok || !contentType?.includes("image")) {
            const errText = Buffer.from(buffer).toString("utf-8");
            console.log("ClipDrop Error:", errText.slice(0, 300));
            return res.status(500).send({
                success: false,
                message: "Background removal failed — " + errText.slice(0, 100),
            });
        }
        const base64 = Buffer.from(buffer).toString("base64");
        const imageUrl = `data:image/png;base64,${base64}`;
        const db = await dbConnection();
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decodedUser.userId) });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        await db.collection("generationHistory").insertOne({
            userId: user._id,
            type: "removeBg",
            meta: {
                originalName: req.file.originalname,
                imageUrl,
            },
            creditsUsed: 1,
            createdAt: new Date()
        });

        return res.status(200).send({
            success: true,
            imageUrl,
            remainingLimit: req.remainingCredits.remaining
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}