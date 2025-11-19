import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const generateResponse = async (prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
  if (!apiKey) return "Error: API Key not found.";
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Unknown error occurred."}`;
  }
};

export const generateStreamResponse = async function* (prompt: string, model: string = 'gemini-2.5-flash') {
  if (!apiKey) {
    yield "Error: API Key not found.";
    return;
  }

  try {
    const response = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error: any) {
    yield `Error: ${error.message}`;
  }
};