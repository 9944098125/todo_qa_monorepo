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
const response_1 = require("../helpers/response");
/**
 * POST /api/ai/chat
 * Authenticated chat endpoint with live multi-domain context and conversation memory.
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
          "Unauthorized: Valid user token is required.",
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
      // 1. Fetch user profile and user's tool categories concurrently
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
      // 2. Build live, role-aware system prompt
      const systemPrompt = (0, systemPrompt_1.buildSystemPrompt)({
        userName:
          (userDoc === null || userDoc === void 0 ? void 0 : userDoc.name) ||
          "User",
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
      const formattedHistory = (Array.isArray(history) ? history : [])
        .slice(-6)
        .map((item) => ({
          role: item.role === "user" ? "user" : "assistant",
          content: String(item.content || ""),
        }));
      // 4. Assemble OpenAI messages array
      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message.trim() },
      ];
      // 5. Invoke OpenRouter API
      const completion =
        yield openRouterClient_1.openai.chat.completions.create({
          model: openRouterClient_1.AI_MODEL,
          messages,
          temperature: 0.3,
          max_tokens: 500,
        });
      const responseContent =
        ((_b =
          (_a = completion.choices[0]) === null || _a === void 0
            ? void 0
            : _a.message) === null || _b === void 0
          ? void 0
          : _b.content) ||
        "I processed your request, but could not generate a response. Please try again.";
      // 6. Return response using standard envelope
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        "AI response generated successfully.",
        {
          message: responseContent,
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
