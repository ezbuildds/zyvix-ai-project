import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export default async function article(req, res) {
    try {
        const { prompt, length, tone } = req.body;
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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            config: {
                temperature: tone === "casual" || tone === "friendly" ? 0.9 : 0.7,
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