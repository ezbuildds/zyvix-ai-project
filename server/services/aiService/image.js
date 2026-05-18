import "dotenv/config";
import jwt from "jsonwebtoken";
import dbConnection from "../../config/database.js";
import { ObjectId } from "mongodb";

export default async function image(req, res) {
    try {
        const { prompt, style, width = 512, height = 512 } = req.body;
        console.log("Image Route Data :", req.body);
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized access"
            });
        }

        if (!prompt?.trim()) {
            return res.status(400).send({
                success: false,
                message: "Prompt is required"
            });
        }

        const STYLE_PROMPTS = {
            photorealistic: "photorealistic, 4k, ultra detailed, professional DSLR photography, sharp focus, realistic lighting",
            anime: "anime style, vibrant colors, cel shading, detailed illustration, japanese animation",
            ghibli: "studio ghibli art style, hayao miyazaki, soft watercolor, whimsical, warm tones, hand drawn animation",
            "3d": "3D render, octane render, cinema4d, unreal engine 5, highly detailed, realistic materials, global illumination",
            artistic: "oil painting, artistic masterpiece, detailed brushwork, impressionist, museum quality, canvas texture",
            cartoon: "cartoon style, pixar animation, colorful, fun, smooth shading, Disney style",
            sketch: "pencil sketch, black and white, detailed linework, graphite drawing, hatching technique",
            realistic: "hyper realistic, photorealistic, 8k resolution, detailed textures, natural lighting, sharp focus",
            cyberpunk: "cyberpunk style, neon lights, futuristic city, blade runner aesthetic, dark atmosphere, glowing",
            watercolor: "watercolor painting, soft edges, color bleeding, artistic, delicate, paper texture",
        };

        const ASPECT_PROMPTS = {
            "512x512": "square composition",
            "768x512": "landscape orientation, wide shot",
            "512x768": "portrait orientation, vertical composition",
            "1024x512": "panoramic wide angle",
            "1024x1024": "square format, centered composition",
        };

        const styleEnhancer = STYLE_PROMPTS[style] || STYLE_PROMPTS.photorealistic;
        const aspectHint = ASPECT_PROMPTS[`${width}x${height}`] || "";
        const finalPrompt = `${prompt}, ${styleEnhancer}${aspectHint ? ", " + aspectHint : ""}`;

        console.log("Final prompt:", finalPrompt);

        const form = new FormData();
        form.append("prompt", finalPrompt);

        const clipdropRes = await fetch("https://clipdrop-api.co/text-to-image/v1", {
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
                message: "Image generation failed — " + errText.slice(0, 100),
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
            type: "image",
            prompt: prompt,
            meta: { style, imageUrl },
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