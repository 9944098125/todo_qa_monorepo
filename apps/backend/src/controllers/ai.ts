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

    // 6. Handle Tool Calling Loop if the model invoked any tools
    if (
      choice.finish_reason === "tool_calls" &&
      choice.message.tool_calls?.length
    ) {
      // Append assistant's tool-call request to messages chain
      messages.push(choice.message);

      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type !== "function") continue;

        const toolName = toolCall.function.name;
        const toolArgs = toolCall.function.arguments;

        // Execute tool securely
        const { toolResult, proposal } = await executeToolCall(
          toolName,
          toolArgs,
          { userId, userName, isAdmin },
        );

        if (proposal) {
          generatedProposal = proposal;
        }

        // Feed tool execution output back to the model
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // 7. Request second completion so the model formulates a natural response
      completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 400,
      });

      choice = completion.choices[0];
    }

    const responseContent =
      choice.message?.content ||
      (generatedProposal
        ? `I have prepared the following proposal: ${generatedProposal.summary}. Please review and confirm below.`
        : "I processed your request.");

    // 8. Return response containing conversational message + any generated proposal
    sendSuccess(req, res, 200, "AI response generated successfully.", {
      message: responseContent,
      proposal: generatedProposal || null,
      model: AI_MODEL,
      isAdmin,
    });
  } catch (error: any) {
    console.error("AI Chat Controller Error:", error);
    next(error);
  }
};
