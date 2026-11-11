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
exports.executeToolCall = executeToolCall;
const Todo_1 = __importDefault(require("../../models/Todo"));
const Tool_1 = __importDefault(require("../../models/Tool"));
const Qa_1 = __importDefault(require("../../models/Qa"));
const User_1 = __importDefault(require("../../models/User"));
const uuid_1 = require("uuid");
/**
 * Dispatches and executes an AI tool call with strict authorization and validation.
 */
function executeToolCall(toolName, rawArgs, context) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    let args = {};
    try {
      args = JSON.parse(rawArgs || "{}");
    } catch (_q) {
      return { toolResult: { error: "Malformed tool arguments JSON." } };
    }
    // 1. Strict Server-Side RBAC Gatekeeper
    if (toolName.startsWith("admin_") && !context.isAdmin) {
      return {
        toolResult: {
          error:
            "ACCESS DENIED: Administrator privileges are required to perform this action.",
        },
      };
    }
    switch (toolName) {
      /**
       * ─── TODO DOMAIN ──────────────────────────────────────────
       */
      case "list_todo_items": {
        const filter = { userId: context.userId };
        if (typeof args.urgency === "boolean") filter.urgency = args.urgency;
        if (args.search) {
          filter.$or = [
            { title: { $regex: args.search, $options: "i" } },
            { description: { $regex: args.search, $options: "i" } },
          ];
        }
        const limit = Math.min(Math.max(Number(args.limit) || 15, 1), 30);
        const todos = yield Todo_1.default
          .find(filter)
          .sort({ deadline: 1, createdAt: -1 })
          .limit(limit)
          .select("_id title description urgency deadline");
        return {
          toolResult: {
            count: todos.length,
            todos: todos.map((t) => ({
              id: t._id.toString(),
              title: t.title,
              description: t.description,
              urgency: t.urgency,
              deadline: t.deadline,
            })),
          },
        };
      }
      case "propose_create_todos": {
        const items = Array.isArray(args.items) ? args.items : [];
        if (items.length === 0) {
          return { toolResult: { error: "No Todo items provided." } };
        }
        // Format and validate items
        const validatedItems = items.map((item) => ({
          tempId: (0, uuid_1.v4)(),
          title: String(item.title || "Untitled Task").trim(),
          description: String(item.description || "").trim(),
          urgency: Boolean(item.urgency),
          deadline:
            item.deadline || new Date(Date.now() + 86400000).toISOString(),
        }));
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TODO",
          actionType: "CREATE",
          items: validatedItems,
          summary: `Create ${validatedItems.length} Todo item${validatedItems.length > 1 ? "s" : ""}`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            count: validatedItems.length,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_update_todo": {
        const existing = yield Todo_1.default.findOne({
          _id: args.todoId,
          userId: context.userId,
        });
        if (!existing) {
          return {
            toolResult: { error: `Todo with ID ${args.todoId} was not found.` },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TODO",
          actionType: "UPDATE",
          items: [
            {
              todoId: existing._id.toString(),
              original: {
                title: existing.title,
                description: existing.description,
                urgency: existing.urgency,
                deadline: existing.deadline,
              },
              updates: {
                title:
                  (_a = args.title) !== null && _a !== void 0
                    ? _a
                    : existing.title,
                description:
                  (_b = args.description) !== null && _b !== void 0
                    ? _b
                    : existing.description,
                urgency:
                  typeof args.urgency === "boolean"
                    ? args.urgency
                    : existing.urgency,
                deadline:
                  (_c = args.deadline) !== null && _c !== void 0
                    ? _c
                    : existing.deadline,
              },
            },
          ],
          summary: `Update Todo: "${existing.title}"`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_delete_todo": {
        const existing = yield Todo_1.default.findOne({
          _id: args.todoId,
          userId: context.userId,
        });
        if (!existing) {
          return {
            toolResult: { error: `Todo with ID ${args.todoId} was not found.` },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TODO",
          actionType: "DELETE",
          items: [{ todoId: existing._id.toString(), title: existing.title }],
          summary: `Delete Todo: "${existing.title}"`,
          isDestructive: true,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      /**
       * ─── TOOL / CATEGORY DOMAIN ──────────────────────────────
       */
      case "list_user_tools": {
        const tools = yield Tool_1.default
          .find({ userId: context.userId })
          .select("_id name slug color description");
        return {
          toolResult: {
            count: tools.length,
            tools: tools.map((t) => ({
              id: t._id.toString(),
              name: t.name,
              slug: t.slug,
              color: t.color,
              description: t.description,
            })),
          },
        };
      }
      case "propose_create_tool": {
        const name = String(args.name || "").trim();
        const slug = String(
          args.slug || name.toLowerCase().replace(/\s+/g, "-"),
        ).trim();
        const color = args.color || "#3b82f6";
        const description = String(args.description || "").trim();
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TOOL",
          actionType: "CREATE",
          items: [{ name, slug, color, description }],
          summary: `Create Tool Category: "${name}"`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_update_tool": {
        const existing = yield Tool_1.default.findOne({
          _id: args.toolId,
          userId: context.userId,
        });
        if (!existing) {
          return {
            toolResult: { error: `Tool with ID ${args.toolId} was not found.` },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TOOL",
          actionType: "UPDATE",
          items: [
            {
              toolId: existing._id.toString(),
              original: {
                name: existing.name,
                slug: existing.slug,
                color: existing.color,
              },
              updates: {
                name:
                  (_d = args.name) !== null && _d !== void 0
                    ? _d
                    : existing.name,
                slug:
                  (_e = args.slug) !== null && _e !== void 0
                    ? _e
                    : existing.slug,
                color:
                  (_f = args.color) !== null && _f !== void 0
                    ? _f
                    : existing.color,
                description:
                  (_g = args.description) !== null && _g !== void 0
                    ? _g
                    : existing.description,
              },
            },
          ],
          summary: `Update Tool Category: "${existing.name}"`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_delete_tool": {
        const existing = yield Tool_1.default.findOne({
          _id: args.toolId,
          userId: context.userId,
        });
        if (!existing) {
          return {
            toolResult: { error: `Tool with ID ${args.toolId} was not found.` },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TOOL",
          actionType: "DELETE",
          items: [{ toolId: existing._id.toString(), name: existing.name }],
          summary: `Delete Tool Category: "${existing.name}" (Warning: QA items may be affected)`,
          isDestructive: true,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      /**
       * ─── QA DOMAIN ───────────────────────────────────────────
       */
      case "list_qa_items": {
        const filter = { userId: context.userId };
        if (args.toolId) filter.toolId = args.toolId;
        if (args.importance) filter.importance = args.importance;
        if (args.search) {
          filter.$or = [
            { question: { $regex: args.search, $options: "i" } },
            { answer: { $regex: args.search, $options: "i" } },
          ];
        }
        const qaList = yield Qa_1.default
          .find(filter)
          .limit(20)
          .select("_id question answer importance toolId");
        return {
          toolResult: {
            count: qaList.length,
            qaItems: qaList.map((q) => ({
              id: q._id.toString(),
              question: q.question,
              answer: q.answer,
              importance: q.importance,
              toolId: q.toolId,
            })),
          },
        };
      }
      case "propose_create_qa": {
        const items = Array.isArray(args.items) ? args.items : [];
        if (items.length === 0) {
          return { toolResult: { error: "No QA items provided." } };
        }
        const targetTool = yield Tool_1.default.findOne({
          _id: args.toolId,
          userId: context.userId,
        });
        if (!targetTool) {
          return {
            toolResult: {
              error: `Target Tool/Category ${args.toolId} does not exist. Please check list_user_tools.`,
            },
          };
        }
        const validatedItems = items.map((item) => ({
          tempId: (0, uuid_1.v4)(),
          toolId: targetTool._id.toString(),
          toolName: targetTool.name,
          question: String(item.question || "").trim(),
          answer: String(item.answer || "").trim(),
          importance: ["Important", "Very Important", "Not Important"].includes(
            item.importance,
          )
            ? item.importance
            : "Important",
        }));
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "QA",
          actionType: "CREATE",
          items: validatedItems,
          summary: `Create ${validatedItems.length} QA item${validatedItems.length > 1 ? "s" : ""} in "${targetTool.name}"`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            count: validatedItems.length,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_update_qa": {
        const existing = yield Qa_1.default.findOne({
          _id: args.qaId,
          userId: context.userId,
        });
        if (!existing) {
          return { toolResult: { error: `QA item ${args.qaId} not found.` } };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "QA",
          actionType: "UPDATE",
          items: [
            {
              qaId: existing._id.toString(),
              original: {
                question: existing.question,
                answer: existing.answer,
                importance: existing.importance,
              },
              updates: {
                question:
                  (_h = args.question) !== null && _h !== void 0
                    ? _h
                    : existing.question,
                answer:
                  (_j = args.answer) !== null && _j !== void 0
                    ? _j
                    : existing.answer,
                importance:
                  (_k = args.importance) !== null && _k !== void 0
                    ? _k
                    : existing.importance,
              },
            },
          ],
          summary: `Update QA: "${existing.question.slice(0, 40)}..."`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_delete_qa": {
        const existing = yield Qa_1.default.findOne({
          _id: args.qaId,
          userId: context.userId,
        });
        if (!existing) {
          return { toolResult: { error: `QA item ${args.qaId} not found.` } };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "QA",
          actionType: "DELETE",
          items: [
            { qaId: existing._id.toString(), question: existing.question },
          ],
          summary: `Delete QA: "${existing.question.slice(0, 40)}..."`,
          isDestructive: true,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      /**
       * ─── ADMIN USER DOMAIN (Protected) ───────────────────────
       */
      case "admin_list_users": {
        const filter = {};
        if (args.search) {
          filter.$or = [
            { name: { $regex: args.search, $options: "i" } },
            { email: { $regex: args.search, $options: "i" } },
            { phone: { $regex: args.search, $options: "i" } },
          ];
        }
        const users = yield User_1.default
          .find(filter)
          .sort({ createdAt: -1 })
          .limit(Number(args.limit) || 10)
          .select("_id name email phone isAdmin createdAt");
        return {
          toolResult: {
            count: users.length,
            users: users.map((u) => ({
              id: u._id.toString(),
              name: u.name,
              email: u.email,
              phone: u.phone,
              isAdmin: Boolean(u.isAdmin),
              createdAt: u.createdAt,
            })),
          },
        };
      }
      case "admin_get_user": {
        const query = {};
        if (args.userId) query._id = args.userId;
        else if (args.email) query.email = args.email;
        else
          return {
            toolResult: { error: "Either userId or email is required." },
          };
        const user = yield User_1.default.findOne(query).select("-password");
        if (!user) return { toolResult: { error: "User not found." } };
        return { toolResult: { user } };
      }
      case "admin_propose_create_user": {
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "USER",
          actionType: "CREATE",
          items: [
            {
              name: String(args.name || "").trim(),
              email: String(args.email || "").trim(),
              password: String(args.password || "").trim(),
              phone: String(args.phone || "").trim(),
              bio: String(args.bio || "").trim(),
              isAdmin: Boolean(args.isAdmin),
            },
          ],
          summary: `Admin Create User: "${args.name}" (${args.email})`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "admin_propose_update_user": {
        const targetUser = yield User_1.default.findById(args.targetUserId);
        if (!targetUser)
          return { toolResult: { error: "Target user not found." } };
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "USER",
          actionType: "UPDATE",
          items: [
            {
              targetUserId: targetUser._id.toString(),
              original: {
                name: targetUser.name,
                email: targetUser.email,
                isAdmin: targetUser.isAdmin,
              },
              updates: {
                name:
                  (_l = args.name) !== null && _l !== void 0
                    ? _l
                    : targetUser.name,
                email:
                  (_m = args.email) !== null && _m !== void 0
                    ? _m
                    : targetUser.email,
                phone:
                  (_o = args.phone) !== null && _o !== void 0
                    ? _o
                    : targetUser.phone,
                bio:
                  (_p = args.bio) !== null && _p !== void 0
                    ? _p
                    : targetUser.bio,
                isAdmin:
                  typeof args.isAdmin === "boolean"
                    ? args.isAdmin
                    : targetUser.isAdmin,
              },
            },
          ],
          summary: `Admin Update User: "${targetUser.name}"`,
          isDestructive: false,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "admin_propose_delete_user": {
        const targetUser = yield User_1.default.findById(args.targetUserId);
        if (!targetUser)
          return { toolResult: { error: "Target user not found." } };
        if (targetUser.isAdmin) {
          return {
            toolResult: {
              error: `Security Rule Violation: User "${targetUser.name}" is an administrator. Admin accounts cannot be deleted.`,
            },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "USER",
          actionType: "DELETE",
          items: [
            {
              targetUserId: targetUser._id.toString(),
              name: targetUser.name,
              email: targetUser.email,
            },
          ],
          summary: `Admin Delete User Account: "${targetUser.name}" (${targetUser.email})`,
          isDestructive: true,
        };
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      default:
        return { toolResult: { error: `Unrecognized tool: ${toolName}` } };
    }
  });
}
