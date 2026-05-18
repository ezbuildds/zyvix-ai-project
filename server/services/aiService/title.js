import "dotenv/config";
import OpenAI from "openai";
import jwt from "jsonwebtoken";
import dbConnection from "../../config/database.js";
import { ObjectId } from "mongodb";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default async function title(req, res) {
    try {
        const { keyword, count, category } = req.body;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized access"
            });
        }
        const finalPrompt = `
                            Generate exactly ${count || 15} catchy, SEO-friendly blog post titles for the following keyword/topic.
                            Keyword/Topic: ${keyword}
                            Category: ${category || "General"}
                            Rules:
                            - Generate EXACTLY ${count} titles
                            - Each title on a new line
                            - No numbering, bullets, or extra formatting
                            - Make them engaging, clickable, and SEO optimized
                            - Mix different styles (How-to, Listicle, Question, Beginner Guide, Mistakes, Trends, etc.)
                            - Return ONLY the titles
                            `;

        const response = await AI.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: finalPrompt
                }
            ],
            temperature: 0.9,
            max_tokens: 1000
        });
        const generatedTitles = response.choices[0].message.content
            .split("\n").map(title => title.replace(/^\d+[\).\-\s]*/g, "")
                .trim()).filter(title => title.length > 5)
            .slice(0, count);
        const db = await dbConnection();
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decodedUser.userId) });
        console.log("title user", user);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        await db.collection("generationHistory").insertOne({
            userId: user._id,
            type: "title",
            prompt: keyword,
            meta: {
                category: category,
                count: count,
            },
            creditsUsed: 1,
            createdAt: new Date()
        })

        return res.status(200).send({
           success:true,
           title:generatedTitles,a
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