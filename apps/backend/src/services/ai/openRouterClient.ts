import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPEN_AI_API_KEY) {
  console.warn(
    "⚠️ Warning: OPEN_AI_API_KEY is not defined in environment variables. AI features will fail.",
  );
}

/**
 * OpenRouter Client configured with the official OpenAI SDK.
 * Reuses the existing OpenRouter baseURL and credentials.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "TodoQA Monorepo",
  },
});

/**
 * Primary model identifier for natural language command processing.
 */
export const AI_MODEL = "meta-llama/llama-3.1-8b-instruct";
