"use server"

import { GoogleGenAI } from "@google/genai"

export async function submitChat(formData: FormData) {
    const apiKey = process.env.NEXT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""
    if (!apiKey) {
        return { success: false, error: "API key is not configured." }
    }

    const ai = new GoogleGenAI({ apiKey })

    const messageHistoryStr = formData.get("messages") as string
    let messages = []
    try {
        messages = JSON.parse(messageHistoryStr)
    } catch (e) {
        return { success: false, error: "Invalid message history format." }
    }

    const file = formData.get("file") as File | null

    try {
        const contents = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }))

        // Add file to the most recent user message
        if (file && file.size > 0) {
            const buffer = await file.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')

            // Ensure the mime type is supported or fallback to octet-stream
            const mimeType = file.type || "application/octet-stream"

            // Add inline data
            const lastUserMessageIndex = contents.map(c => c.role).lastIndexOf('user');
            if (lastUserMessageIndex !== -1) {
                contents[lastUserMessageIndex].parts.push({
                    inlineData: {
                        data: base64,
                        mimeType: mimeType
                    }
                })
            }
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: "You are a helpful financial AI assistant. Provide concise, insightful, and accurate answers regarding financial models, reports, and data.",
            }
        })

        return { success: true, text: response.text }
    } catch (error: any) {
        console.error("Gemini Error:", error)
        return { success: false, error: error.message || "Failed to generate response" }
    }
}
