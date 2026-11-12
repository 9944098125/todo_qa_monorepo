"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAiChat = void 0;
const User_1 = __importDefault(require("../models/User"));
const Tool_1 = __importDefault(require("../models/Tool"));
const openRouterClient_1 = require("../services/ai/openRouterClient");
const systemPrompt_1 = require("../services/ai/systemPrompt");
const toolDefinitions_1 = require("../services/ai/toolDefinitions");
const toolExecutor_1 = require("../services/ai/toolExecutor");
const response_1 = require("../helpers/response");
/**
 * POST /api/ai/chat
 * Multi-domain tool-calling AI controller with dynamic authorization gatekeeping.
 */
const handleAiChat = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    var _c;
    try {
      const userPayload = req.user;
      if (
        !(userPayload === null || userPayload === void 0
          ? void 0
          : userPayload.userId)
      ) {
        (0, response_1.sendError)(
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
        (0, response_1.sendError)(
          req,
          res,
          400,
          "Bad Request: 'message' string is required.",
        );
        return;
      }
      // 1. Fetch user profile and available categories
      const [userDoc, tools] = yield Promise.all([
        User_1.default.findById(userId).select("name email isAdmin"),
        Tool_1.default.find({ userId }).select("_id name slug color"),
      ]);
      const isAdmin = Boolean(
        (_c =
          userDoc === null || userDoc === void 0 ? void 0 : userDoc.isAdmin) !==
          null && _c !== void 0
          ? _c
          : userPayload.isAdmin,
      );
      const userName =
        (userDoc === null || userDoc === void 0 ? void 0 : userDoc.name) ||
        "User";
      // 2. Generate dynamic system prompt and retrieve authorized tools
      const systemPrompt = (0, systemPrompt_1.buildSystemPrompt)({
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
      const availableTools = (0, toolDefinitions_1.getAvailableTools)(isAdmin);
      // 3. Format conversation history
      const formattedHistory = (Array.isArray(history) ? history : [])
        .slice(-6)
        .map((item) => ({
          role: item.role === "user" ? "user" : "assistant",
          content: String(item.content || ""),
        }));
      // 4. Assemble message chain
      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message.trim() },
      ];
      // 5. Initial completion call to OpenRouter with tools
      let completion = yield openRouterClient_1.openai.chat.completions.create({
        model: openRouterClient_1.AI_MODEL,
        messages,
        tools: availableTools,
        tool_choice: "auto",
        temperature: 0.1, // Low temperature for deterministic tool calling
        max_tokens: 600,
      });
      let choice = completion.choices[0];
      let generatedProposal;
      let wasExecuted = false;
      let executedModule;
      // Multi-step tool execution loop (up to 5 iterations)
      let iterations = 0;
      while (
        ((_a = choice.message) === null || _a === void 0
          ? void 0
          : _a.tool_calls) &&
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
          } = yield (0, toolExecutor_1.executeToolCall)(
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
        completion = yield openRouterClient_1.openai.chat.completions.create({
          model: openRouterClient_1.AI_MODEL,
          messages,
          tools: availableTools,
          tool_choice: "auto",
          temperature: 0.1,
          max_tokens: 500,
        });
        choice = completion.choices[0];
      }
      const responseContent =
        ((_b = choice.message) === null || _b === void 0
          ? void 0
          : _b.content) ||
        (generatedProposal
          ? `I have prepared the proposal: ${generatedProposal.summary}. Please confirm to execute.`
          : "Done.");
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        "AI response generated successfully.",
        {
          message: responseContent,
          proposal: generatedProposal || null,
          executed: wasExecuted,
          executedModule: executedModule || null,
          model: openRouterClient_1.AI_MODEL,
          isAdmin,
        },
      );
    } catch (error) {
      console.error("AI Chat Controller Error:", error);
      next(error);
    }
  });
exports.handleAiChat = handleAiChat;
