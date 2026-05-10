
// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });
// export default async function article(req, res) {
//     try {
//         const { prompt, length, tone } = req.body;
//         const finalPrompt = `
//                             Write a complete article.
//                             Topic: ${prompt}
//                             Tone: ${tone || "professional"}
//                             STRICT REQUIREMENTS:
//                             - Approximately ${length || 800} words  
//                             - Must include Title (# heading), Introduction, Subheadings (##, ###), Conclusion
//                             - Tone should strictly be: ${tone || "professional"}
//                             - Detailed and engaging, do not stop midway
//                             - Use proper Markdown formatting (##, ###, **bold**, *italic*, - lists)
//                             - Return only the article content, no preamble or extra explanation
//                             `
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash-lite",
//             contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
//             config: {
//                  temperature: toneConfig.temperature,
//                 maxOutputTokens: length ? Math.ceil(length * 2) : 2000,
//             },
//         });
//         return res.status(200).send({
//             success: true,
//             content: response.text,
//         });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send({
//             success: false,
//             message: error.message,
//         });
//     }
// }


import "dotenv/config";
import OpenAI from "openai";
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export default async function article(req, res) {
    try {
        const { prompt, length, tone } = req.body;
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
        console.log("middleware remaining:", req.remainingCredits.remaining);

        return res.status(200).send({
            success: true,
            content: response.choices[0].message.content,
            remainingLimit: req.remainingCredits.remaining
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
}
