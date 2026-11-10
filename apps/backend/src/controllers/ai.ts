import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Tool from "../models/Tool";
import { openai, AI_MODEL } from "../services/ai/openRouterClient";
import { buildSystemPrompt } from "../services/ai/systemPrompt";
import { sendError, sendSuccess } from "../helpers/response";

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * POST /api/ai/chat
 * Authenticated chat endpoint with live multi-domain context and conversation memory.
 */
export const handleAiChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userPayload = (req as any).user;

    if (!userPayload?.userId) {
      sendError(req, res, 401, "Unauthorized: Valid user token is required.");
      return;
    }

    const userId = userPayload.userId;
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      sendError(req, res, 400, "Bad Request: 'message' string is required.");
      return;
    }

    // 1. Fetch user profile and user's tool categories concurrently
    const [userDoc, tools] = await Promise.all([
      User.findById(userId).select("name email isAdmin"),
      Tool.find({ userId }).select("_id name slug color"),
    ]);

    const isAdmin = Boolean(userDoc?.isAdmin ?? userPayload.isAdmin);

    // 2. Build live, role-aware system prompt
    const systemPrompt = buildSystemPrompt({
      userName: userDoc?.name || "User",
      userId,
      isAdmin,
      tools: tools.map((t) => ({
        _id: t._id.toString(),
        name: t.name,
        slug: t.slug,
        color: t.color,
      })),
    });

    // 3. Format history (cap to last 6 turns to manage token window efficiently)
    const formattedHistory: Array<{
      role: "user" | "assistant";
      content: string;
    }> = (Array.isArray(history) ? history : []).slice(-6).map((item: any) => ({
      role: item.role === "user" ? "user" : "assistant",
      content: String(item.content || ""),
    }));

    // 4. Assemble OpenAI messages array
    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message.trim() },
    ];

    // 5. Invoke OpenRouter API
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
      "I processed your request, but could not generate a response. Please try again.";

    // 6. Return response using standard envelope
    sendSuccess(req, res, 200, "AI response generated successfully.", {
      message: responseContent,
      model: AI_MODEL,
      isAdmin,
    });
  } catch (error: any) {
    console.error("AI Chat Controller Error:", error);
    next(error);
  }
};
