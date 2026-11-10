"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_MODEL = exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.OPEN_AI_API_KEY) {
  console.warn(
    "⚠️ Warning: OPEN_AI_API_KEY is not defined in environment variables. AI features will fail.",
  );
}
/**
 * OpenRouter Client configured with the official OpenAI SDK.
 * Reuses the existing OpenRouter baseURL and credentials.
 */
exports.openai = new openai_1.default({
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
exports.AI_MODEL = "meta-llama/llama-3.1-8b-instruct";
