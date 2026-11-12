import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Tool from "../models/Tool";
import { openai, AI_MODEL } from "../services/ai/openRouterClient";
import { buildSystemPrompt } from "../services/ai/systemPrompt";
import { getAvailableTools } from "../services/ai/toolDefinitions";
import { executeToolCall, ProposalPayload } from "../services/ai/toolExecutor";
import { sendError, sendSuccess } from "../helpers/response";

/**
 * POST /api/ai/chat
 * Multi-domain tool-calling AI controller with dynamic authorization gatekeeping.
 */
export const handleAiChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userPayload = (req as any).user;

    if (!userPayload?.userId) {
      sendError(
        req,
        res,
        401,
        "Unauthorized: User identification missing from token.",
      );
      return;
    }

    const userId = userPayload.userId;
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      sendError(req, res, 400, "Bad Request: 'message' string is required.");
      return;
    }

    // 1. Fetch user profile and available categories
    const [userDoc, tools] = await Promise.all([
      User.findById(userId).select("name email isAdmin"),
      Tool.find({ userId }).select("_id name slug color"),
    ]);

    const isAdmin = Boolean(userDoc?.isAdmin ?? userPayload.isAdmin);
    const userName = userDoc?.name || "User";

    // 2. Generate dynamic system prompt and retrieve authorized tools
    const systemPrompt = buildSystemPrompt({
      userName,
      userId,
      isAdmin,
      tools: tools.map((t) => ({
        _id: t._id.toString(),
        name: t.name,
        slug: t.slug,
        color: t.color,
      })),
    });

    const availableTools = getAvailableTools(isAdmin);

    // 3. Format conversation history
    const formattedHistory: any[] = (Array.isArray(history) ? history : [])
      .slice(-6)
      .map((item: any) => ({
        role: item.role === "user" ? "user" : "assistant",
        content: String(item.content || ""),
      }));

    // 4. Assemble message chain
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message.trim() },
    ];

    // 5. Initial completion call to OpenRouter with tools
    let completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      tools: availableTools,
      tool_choice: "auto",
      temperature: 0.1, // Low temperature for deterministic tool calling
      max_tokens: 600,
    });

    let choice = completion.choices[0];
    let generatedProposal: ProposalPayload | undefined;
    let wasExecuted = false;
    let executedModule: string | undefined;

    // Multi-step tool execution loop (up to 5 iterations)
    let iterations = 0;
    while (
      choice.message?.tool_calls &&
      choice.message.tool_calls.length > 0 &&
      iterations < 5
    ) {
      iterations++;
      messages.push(choice.message);

      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type !== "function") continue;

        const {
          toolResult,
          proposal,
          executed,
          executedModule: mod,
        } = await executeToolCall(
          toolCall.function.name,
          toolCall.function.arguments,
          { userId, userName, isAdmin },
        );

        if (proposal) generatedProposal = proposal;
        if (executed) {
          wasExecuted = true;
          executedModule = mod;
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // Feed tool outputs back to the model (keeping tools available for multi-step chains)
      completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages,
        tools: availableTools,
        tool_choice: "auto",
        temperature: 0.1,
        max_tokens: 500,
      });

      choice = completion.choices[0];
    }

    const responseContent =
      choice.message?.content ||
      (generatedProposal
        ? `I have prepared the proposal: ${generatedProposal.summary}. Please confirm to execute.`
        : "Done.");

    sendSuccess(req, res, 200, "AI response generated successfully.", {
      message: responseContent,
      proposal: generatedProposal || null,
      executed: wasExecuted,
      executedModule: executedModule || null,
      model: AI_MODEL,
      isAdmin,
    });
  } catch (error: any) {
    console.error("AI Chat Controller Error:", error);
    next(error);
  }
};
