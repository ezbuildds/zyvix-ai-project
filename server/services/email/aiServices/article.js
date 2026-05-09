import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export default async function article(req, res) {
    try {
        const { prompt, length } = req.body;
        const finalPrompt = `
                    Write a complete article.
                    Topic: ${prompt}
                    STRICT REQUIREMENTS:
                    - Approximately ${length || 800} words
                    - Must include Title, Introduction, Headings, Conclusion
                    - Detailed and not short
                    - Do not stop mid way
                    `
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            config: {
                temperature: 0.7,
                maxOutputTokens: length ? Math.ceil(length * 2) : 2000,
            },
        });
        return res.status(200).send({
            success: true,
            content: response.text,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
}

