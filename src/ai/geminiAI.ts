import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API Key in .env file");
}

// 1. Initialize the client
export const aiClient = new GoogleGenAI({ apiKey });

export const MODEL_NAME = "gemini-2.5-flash";