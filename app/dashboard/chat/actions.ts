"use server"

import { GoogleGenAI } from "@google/genai"
import * as XLSX from "xlsx"

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
            const mimeType = file.type || "application/octet-stream"
            const fileName = file.name.toLowerCase()

            const lastUserMessageIndex = contents.map((c: any) => c.role).lastIndexOf('user')

            if (lastUserMessageIndex !== -1) {
                // Determine file type and parse accordingly
                if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm') || fileName.endsWith('.csv')) {
                    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                    let spreadsheetText = `--- Attached Spreadsheet (${file.name}) ---\n\n`;
                    for (const sheetName of workbook.SheetNames) {
                        const worksheet = workbook.Sheets[sheetName];
                        const csv = XLSX.utils.sheet_to_csv(worksheet);
                        spreadsheetText += `[Sheet: ${sheetName}]\n${csv}\n\n`;
                    }
                    spreadsheetText += `--- End Attached Spreadsheet ---\n`;

                    contents[lastUserMessageIndex].parts.push({
                        text: spreadsheetText
                    })
                }
                else if (mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.json')) {
                    const textData = Buffer.from(buffer).toString('utf-8');
                    contents[lastUserMessageIndex].parts.push({
                        text: `\n\n--- Attached File (${file.name}) ---\n${textData}\n--- End Attached File ---\n`
                    })
                }
                else if (fileName.endsWith('.pdf') || mimeType.startsWith('image/')) {
                    const base64 = Buffer.from(buffer).toString('base64')
                    contents[lastUserMessageIndex].parts.push({
                        inlineData: {
                            data: base64,
                            mimeType: mimeType === "application/pdf" ? "application/pdf" : mimeType
                        }
                    })
                } else {
                    return { success: false, error: "Unsupported file type. Please upload Excel (xls, xlsx, xlsm), CSV, JSON, Image, PDF, or Text files." }
                }
            }
        }

    const modelContext = formData.get("modelContext") as string | null

    const systemInstruction = modelContext
        ? `You are a highly capable financial AI assistant. Provide concise, insightful, and highly accurate answers with proper markdown formatting regarding financial models, reports, and data. Use bolding to highlight key terms and properly space your output.

The user has loaded the following financial model data as context. Use these numbers to answer their questions precisely:

${modelContext}

When answering questions about the model, reference specific line items and figures from the data above.`
        : "You are a highly capable financial AI assistant. Provide concise, insightful, and highly accurate answers with proper markdown formatting regarding financial models, reports, and data. Use bolding to highlight key terms and properly space your output."

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction,
            }
        })

        return { success: true, text: response.text }
    } catch (error: any) {
        console.error("Gemini Error:", error)
        return { success: false, error: error.message || "Failed to generate response" }
    }
}
