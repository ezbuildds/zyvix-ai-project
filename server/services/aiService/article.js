
import "dotenv/config";
import OpenAI from "openai";
import jwt from "jsonwebtoken"
import dbConnection from "../../config/database.js";
import { ObjectId } from "mongodb";
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export default async function article(req, res) {
    try {
        const { prompt, length, tone, title } = req.body;
        const token = req.cookies.token
        console.log(req.body);
        const finalPrompt = `
                            Write a complete article.
                             Topic: ${prompt}
                           Tone: ${tone || "professional"}
                            STRICT REQUIREMENTS:
                            - Approximately ${length || 800} words  
                            - Must include Title (# heading), Introduction, Subheadings (##, ###), Conclusion
                            - Tone should strictly be: ${tone || "professional"}
                            - Detailed and engaging, do not stop midway
                           - Use proper Markdown formatting (##, ###, **bold**, *italic*, - lists)
                           - Return only the article content, no preamble or extra explanation
                           `

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: finalPrompt
                },
            ],
            temperature: 0.7,
            max_tokens: length ? Math.ceil(length * 2) : 2000,

        });
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unothorized access"
            });
        }
        const db = await dbConnection();
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decodedUser.userId) });
        console.log("artical user", user);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: " User not found"
            });
        }
        await db.collection("generationHistory").insertOne({ userId: user._id, prompt: prompt, words: length, tone: tone, title: title, creditsUsed: 1, createdAt: new Date() })
        return res.status(200).send({
            success: true,
            content: response.choices[0].message.content,
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
