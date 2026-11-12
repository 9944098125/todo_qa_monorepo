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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pendingProposals = new Map();
const latestProposalByUser = new Map();
// Clean up expired proposals every 5 minutes (15-minute TTL)
setInterval(
  () => {
    const now = Date.now();
    pendingProposals.forEach((entry, id) => {
      if (now - entry.createdAt > 15 * 60 * 1000) {
        pendingProposals.delete(id);
        if (latestProposalByUser.get(entry.userId) === id) {
          latestProposalByUser.delete(entry.userId);
        }
      }
    });
  },
  5 * 60 * 1000,
);
function stageProposal(userId, proposal) {
  pendingProposals.set(proposal.proposalId, {
    proposal,
    userId,
    createdAt: Date.now(),
  });
  latestProposalByUser.set(userId, proposal.proposalId);
}
/**
 * Safely parses LLM tool arguments, handling accidental extra braces or markdown wrappers.
 */
function safeParseToolArgs(rawArgs) {
  if (!rawArgs) return {};
  let cleaned = rawArgs.trim();
  // Strip ```json ... ``` if present
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();
  // Strip accidental double outer braces {{ ... }}
  if (cleaned.startsWith("{{") && cleaned.endsWith("}}")) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return JSON.parse(cleaned);
}
function executeToolCall(toolName, rawArgs, context) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    var _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y;
    console.log(`[AI Tool Call] ${toolName} | Args: ${rawArgs}`);
    let args = {};
    try {
      args = safeParseToolArgs(rawArgs);
    } catch (err) {
      console.error(`[AI Tool Parse Error] ${toolName}:`, rawArgs);
      return {
        toolResult: {
          error: "Malformed tool arguments JSON. Please emit valid JSON.",
        },
      };
    }
    // Strict Server-Side RBAC Gatekeeper
    if (
      (toolName === "propose_delete_user" ||
        toolName === "admin_propose_delete_user" ||
        toolName === "propose_create_user" ||
        toolName === "admin_propose_create_user") &&
      !context.isAdmin
    ) {
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
        // If overdue is requested, only uncompleted tasks can be overdue
        if (args.overdue === true || args.isCompleted === false) {
          filter.isCompleted = { $ne: true };
        } else if (args.isCompleted === true) {
          filter.isCompleted = true;
        }
        if (typeof args.urgency === "boolean") filter.urgency = args.urgency;
        if (args.search) {
          filter.$or = [
            { title: { $regex: args.search, $options: "i" } },
            { description: { $regex: args.search, $options: "i" } },
          ];
        }
        const allMatching = yield Todo_1.default
          .find(filter)
          .sort({ isCompleted: 1, deadline: 1, createdAt: -1 })
          .select("_id title description urgency deadline isCompleted");
        const now = new Date();
        const beforeDate = args.deadlineBefore
          ? new Date(
              /^\d{4}-\d{2}-\d{2}$/.test(args.deadlineBefore.trim())
                ? `${args.deadlineBefore.trim()}T23:59:59.999Z`
                : args.deadlineBefore,
            )
          : null;
        const afterDate = args.deadlineAfter
          ? new Date(args.deadlineAfter)
          : null;
        // Apply exact Date-based deadline filtering
        const filtered = allMatching.filter((t) => {
          const taskDeadline = new Date(t.deadline);
          if (isNaN(taskDeadline.getTime())) return false;
          if (args.overdue === true && taskDeadline >= now) return false;
          if (
            beforeDate &&
            !isNaN(beforeDate.getTime()) &&
            taskDeadline > beforeDate
          )
            return false;
          if (
            afterDate &&
            !isNaN(afterDate.getTime()) &&
            taskDeadline < afterDate
          )
            return false;
          return true;
        });
        const limit = Math.min(Math.max(Number(args.limit) || 30, 1), 50);
        const sliced = filtered.slice(0, limit);
        return {
          toolResult: {
            totalMatchingCount: filtered.length,
            returnedCount: sliced.length,
            currentServerTime: now.toISOString(),
            todos: sliced.map((t) => {
              const taskDeadline = new Date(t.deadline);
              const isPast =
                !isNaN(taskDeadline.getTime()) && taskDeadline < now;
              return {
                id: t._id.toString(),
                title: t.title,
                description: t.description,
                urgency: t.urgency,
                deadline: t.deadline,
                isCompleted: Boolean(t.isCompleted),
                isOverdue: !Boolean(t.isCompleted) && isPast,
              };
            }),
          },
        };
      }
      case "propose_create_todos": {
        const items = Array.isArray(args.items) ? args.items : [];
        if (items.length === 0) {
          return { toolResult: { error: "No Todo items provided." } };
        }
        const defaultDeadline = new Date(Date.now() + 86400000).toISOString();
        const validatedItems = items.map((item) => {
          const cleanTitle = String(item.title || "Untitled Task").trim();
          return {
            tempId: (0, uuid_1.v4)(),
            title: cleanTitle,
            description: String(item.description || cleanTitle).trim(),
            urgency: Boolean(item.urgency),
            deadline: item.deadline || defaultDeadline,
            isCompleted: false,
          };
        });
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TODO",
          actionType: "CREATE",
          items: validatedItems,
          summary: `Create ${validatedItems.length} Todo item${validatedItems.length > 1 ? "s" : ""}: ${validatedItems.map((i) => `"${i.title}"`).join(", ")}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            count: validatedItems.length,
            summary: proposal.summary,
            instruction:
              "Ask the user to confirm. Once they confirm, call execute_proposal.",
          },
          proposal,
        };
      }
      case "propose_update_todo": {
        let existing = null;
        if (args.todoId && /^[0-9a-fA-F]{24}$/.test(args.todoId)) {
          existing = yield Todo_1.default.findOne({
            _id: args.todoId,
            userId: context.userId,
          });
        } else if (args.searchTitle) {
          existing = yield Todo_1.default.findOne({
            userId: context.userId,
            title: { $regex: new RegExp(args.searchTitle.trim(), "i") },
          });
        }
        if (!existing) {
          return {
            toolResult: {
              error: `Todo not found matching ${args.todoId || args.searchTitle}.`,
            },
          };
        }
        const updates = {};
        if (args.title) updates.title = args.title;
        if (args.description) updates.description = args.description;
        if (typeof args.urgency === "boolean") updates.urgency = args.urgency;
        if (args.deadline) updates.deadline = args.deadline;
        if (typeof args.isCompleted === "boolean")
          updates.isCompleted = args.isCompleted;
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
                isCompleted: existing.isCompleted,
              },
              updates,
            },
          ],
          summary: `Update Todo: "${existing.title}"`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
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
        let existing = null;
        if (args.todoId && /^[0-9a-fA-F]{24}$/.test(args.todoId)) {
          existing = yield Todo_1.default.findOne({
            _id: args.todoId,
            userId: context.userId,
          });
        } else if (args.title) {
          const matches = yield Todo_1.default.find({
            userId: context.userId,
            title: { $regex: new RegExp(args.title.trim(), "i") },
          });
          if (matches.length === 0) {
            return {
              toolResult: {
                error: `No task found with title "${args.title}".`,
              },
            };
          }
          if (matches.length > 1) {
            return {
              toolResult: {
                error: `Found ${matches.length} tasks matching "${args.title}": ${matches.map((m) => `"${m.title}"`).join(", ")}. Please specify the exact title.`,
              },
            };
          }
          existing = matches[0];
        }
        if (!existing) {
          return {
            toolResult: {
              error: "Please provide the exact todoId or title to delete.",
            },
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
        stageProposal(context.userId, proposal);
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
          .select("_id name slug color description image");
        return {
          toolResult: {
            count: tools.length,
            tools: tools.map((t) => ({
              id: t._id.toString(),
              name: t.name,
              slug: t.slug,
              color: t.color,
              image: t.image || "",
              description: t.description,
            })),
          },
        };
      }
      case "propose_create_tool": {
        const name = String(args.name || "").trim();
        const slug = String(
          args.slug || name.toLowerCase().replace(/\s+/g, "-"),
        )
          .trim()
          .toLowerCase();
        const color = args.color || "#3b82f6";
        const description = String(args.description || "").trim();
        const rawImage =
          (_c =
            (_b = args.image) !== null && _b !== void 0 ? _b : args.logoUrl) !==
            null && _c !== void 0
            ? _c
            : args.logo;
        const image = typeof rawImage === "string" ? rawImage.trim() : "";
        if (image && !/^(https?:\/\/|\/|data:image\/)/i.test(image)) {
          return {
            toolResult: {
              error:
                "Invalid tool image URL. Please provide a valid http/https image URL.",
            },
          };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TOOL",
          actionType: "CREATE",
          items: [{ name, slug, color, description, image }],
          summary: `Create Tool Category: "${name}"${image ? " (with logo)" : ""}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
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
        let existing = null;
        if (args.toolId && /^[0-9a-fA-F]{24}$/.test(args.toolId)) {
          existing = yield Tool_1.default.findOne({
            _id: args.toolId,
            userId: context.userId,
          });
        } else if (args.searchName || args.toolName || args.name) {
          const lookup = String(
            args.searchName || args.toolName || args.name,
          ).trim();
          const escapedLookup = lookup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          existing = yield Tool_1.default.findOne({
            userId: context.userId,
            name: { $regex: new RegExp(escapedLookup, "i") },
          });
        }
        if (!existing) {
          return { toolResult: { error: `Tool category not found.` } };
        }
        const rawImage =
          (_e =
            (_d = args.image) !== null && _d !== void 0 ? _d : args.logoUrl) !==
            null && _e !== void 0
            ? _e
            : args.logo;
        if (
          typeof rawImage === "string" &&
          rawImage.trim() &&
          !/^(https?:\/\/|\/|data:image\/)/i.test(rawImage.trim())
        ) {
          return {
            toolResult: {
              error:
                "Invalid tool image URL. Please provide a valid http/https image URL.",
            },
          };
        }
        const updates = {};
        if (
          typeof args.name === "string" &&
          args.name.trim() &&
          (args.searchName ||
            args.toolName ||
            args.toolId ||
            args.name.trim() !== existing.name)
        ) {
          updates.name = args.name.trim();
        }
        if (args.slug) updates.slug = String(args.slug).trim().toLowerCase();
        if (args.color) updates.color = args.color;
        if (typeof args.description === "string")
          updates.description = args.description;
        if (typeof rawImage === "string") updates.image = rawImage.trim();
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
                image: existing.image || "",
                description: existing.description || "",
              },
              updates,
            },
          ],
          summary: `Update Tool Category: "${existing.name}"${updates.image !== undefined ? " (logo updated)" : ""}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
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
        let existing = null;
        if (args.toolId && /^[0-9a-fA-F]{24}$/.test(args.toolId)) {
          existing = yield Tool_1.default.findOne({
            _id: args.toolId,
            userId: context.userId,
          });
        } else if (args.name) {
          existing = yield Tool_1.default.findOne({
            userId: context.userId,
            name: { $regex: new RegExp(`^${args.name.trim()}$`, "i") },
          });
        }
        if (!existing) {
          return { toolResult: { error: `Tool category not found.` } };
        }
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "TOOL",
          actionType: "DELETE",
          items: [{ toolId: existing._id.toString(), name: existing.name }],
          summary: `Delete Tool Category: "${existing.name}"`,
          isDestructive: true,
        };
        stageProposal(context.userId, proposal);
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
        if (args.toolId) {
          filter.toolId = args.toolId;
        } else if (args.toolName) {
          const matchedTool = yield Tool_1.default
            .findOne({
              userId: context.userId,
              name: { $regex: new RegExp(String(args.toolName).trim(), "i") },
            })
            .select("_id");
          if (!matchedTool) {
            return {
              toolResult: {
                error: `No tool category found matching "${args.toolName}".`,
              },
            };
          }
          filter.toolId = matchedTool._id.toString();
        }
        if (
          args.importance &&
          typeof args.importance === "string" &&
          args.importance.toLowerCase() !== "all"
        ) {
          filter.importance = args.importance;
        }
        if (args.search) {
          filter.$or = [
            { question: { $regex: args.search, $options: "i" } },
            { answer: { $regex: args.search, $options: "i" } },
          ];
        }
        const sortParam =
          args.sort === "old-to-new" ? "old-to-new" : "new-to-old";
        const sortDirection = sortParam === "old-to-new" ? 1 : -1;
        const limit = Math.min(Math.max(Number(args.limit) || 20, 1), 50);
        const [totalMatchingCount, qaList] = yield Promise.all([
          Qa_1.default.countDocuments(filter),
          Qa_1.default
            .find(filter)
            .sort({ createdAt: sortDirection })
            .limit(limit)
            .select("_id question answer importance toolId createdAt"),
        ]);
        return {
          toolResult: {
            totalMatchingCount,
            returnedCount: qaList.length,
            sortOrder: sortParam,
            importanceFilter: args.importance || "all",
            qaItems: qaList.map((q) => ({
              id: q._id.toString(),
              question: q.question,
              answer: q.answer,
              importance: q.importance,
              toolId: q.toolId,
              createdAt: q.createdAt,
            })),
          },
        };
      }
      case "set_qa_filters": {
        const nextFilters = {};
        if (args.sort === "new-to-old" || args.sort === "old-to-new") {
          nextFilters.sort = args.sort;
        }
        if (
          args.importance &&
          ["all", "Important", "Very Important", "Not Important"].includes(
            args.importance,
          )
        ) {
          nextFilters.importance = args.importance;
        }
        if (!nextFilters.sort && !nextFilters.importance) {
          return {
            toolResult: {
              error:
                "Please specify either a valid sort order or importance filter.",
            },
          };
        }
        return {
          toolResult: {
            status: "UI_FILTERS_UPDATED",
            qaFilters: nextFilters,
          },
          qaFilters: nextFilters,
        };
      }
      case "set_theme": {
        const theme = args.theme;
        if (!["light", "dark", "toggle"].includes(theme)) {
          return {
            toolResult: {
              error: "Invalid theme. Must be 'light', 'dark', or 'toggle'.",
            },
          };
        }
        return {
          toolResult: {
            status: "THEME_UPDATED",
            theme,
          },
          theme,
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
              error: `Target category ID ${args.toolId} does not exist.`,
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
        stageProposal(context.userId, proposal);
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_update_qa": {
        let existing = null;
        if (args.qaId && /^[0-9a-fA-F]{24}$/.test(args.qaId)) {
          existing = yield Qa_1.default.findOne({
            _id: args.qaId,
            userId: context.userId,
          });
        } else if (args.searchQuestion) {
          existing = yield Qa_1.default.findOne({
            userId: context.userId,
            question: { $regex: new RegExp(args.searchQuestion.trim(), "i") },
          });
        }
        if (!existing) {
          return { toolResult: { error: `QA item not found.` } };
        }
        const updates = {};
        if (args.question) updates.question = args.question.trim();
        if (args.answer) updates.answer = args.answer.trim();
        if (
          ["Important", "Very Important", "Not Important"].includes(
            args.importance,
          )
        ) {
          updates.importance = args.importance;
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
              updates,
            },
          ],
          summary: `Update QA: "${existing.question.slice(0, 40)}..."`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
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
        let existing = null;
        if (args.qaId && /^[0-9a-fA-F]{24}$/.test(args.qaId)) {
          existing = yield Qa_1.default.findOne({
            _id: args.qaId,
            userId: context.userId,
          });
        } else if (args.questionSummary) {
          const matches = yield Qa_1.default.find({
            userId: context.userId,
            question: { $regex: new RegExp(args.questionSummary.trim(), "i") },
          });
          if (matches.length === 0) {
            return {
              toolResult: {
                error: `No QA item found matching "${args.questionSummary}".`,
              },
            };
          }
          if (matches.length > 1) {
            return {
              toolResult: {
                error: `Found ${matches.length} matching QA items. Please specify which one to delete.`,
              },
            };
          }
          existing = matches[0];
        }
        if (!existing) {
          return { toolResult: { error: `QA item not found.` } };
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
        stageProposal(context.userId, proposal);
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
       * ─── USER & PROFILE DOMAIN ────────────────────────────────
       */
      case "get_my_profile": {
        const user = yield User_1.default
          .findById(context.userId)
          .select("-password");
        if (!user) return { toolResult: { error: "User profile not found." } };
        return { toolResult: { profile: user } };
      }
      case "propose_update_my_profile": {
        const existing = yield User_1.default.findById(context.userId);
        if (!existing)
          return { toolResult: { error: "User profile not found." } };
        const rawPic =
          (_l =
            (_k =
              (_j =
                (_h =
                  (_g =
                    (_f = args.profilePicture) !== null && _f !== void 0
                      ? _f
                      : args.image) !== null && _g !== void 0
                    ? _g
                    : args.imageUrl) !== null && _h !== void 0
                  ? _h
                  : args.avatar) !== null && _j !== void 0
                ? _j
                : args.avatarUrl) !== null && _k !== void 0
              ? _k
              : args.logo) !== null && _l !== void 0
            ? _l
            : args.logoUrl;
        if (typeof rawPic === "string" && rawPic.trim()) {
          const cleanPic = rawPic.trim();
          if (!/^(https?:\/\/|\/|data:image\/)/i.test(cleanPic)) {
            return {
              toolResult: {
                error:
                  "Invalid profile picture URL. Please provide a valid http/https image URL.",
              },
            };
          }
        }
        const updates = {};
        if (
          typeof args.name === "string" &&
          args.name.trim() &&
          args.name.trim() !== existing.name
        ) {
          updates.name = args.name.trim();
        }
        if (args.email && args.email.trim() !== existing.email)
          updates.email = args.email.trim();
        if (args.phone) updates.phone = args.phone.trim();
        if (typeof args.bio === "string") updates.bio = args.bio;
        if (typeof rawPic === "string") updates.profilePicture = rawPic.trim();
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "USER",
          actionType: "UPDATE",
          items: [
            {
              targetUserId: existing._id.toString(),
              original: {
                name: existing.name,
                email: existing.email,
                phone: existing.phone,
                profilePicture: existing.profilePicture || "",
                bio: existing.bio || "",
                isAdmin: existing.isAdmin,
              },
              updates,
            },
          ],
          summary: `Update My Profile: "${existing.name}"${updates.profilePicture !== undefined ? " (profile picture updated)" : ""}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "list_users":
      case "admin_list_users": {
        const filter = {};
        if (args.search) {
          filter.$or = [
            { name: { $regex: args.search, $options: "i" } },
            { email: { $regex: args.search, $options: "i" } },
          ];
        }
        const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);
        const [totalMatchingCount, users] = yield Promise.all([
          User_1.default.countDocuments(filter),
          User_1.default
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("_id name email phone profilePicture isAdmin createdAt"),
        ]);
        return {
          toolResult: {
            totalMatchingCount,
            returnedCount: users.length,
            users: users.map((u) => ({
              id: u._id.toString(),
              name: u.name,
              email: u.email,
              phone: u.phone,
              profilePicture: u.profilePicture || "",
              isAdmin: Boolean(u.isAdmin),
              createdAt: u.createdAt,
            })),
          },
        };
      }
      case "get_user_details":
      case "admin_get_user": {
        const query = {};
        if (args.userId && /^[0-9a-fA-F]{24}$/.test(args.userId)) {
          query._id = args.userId;
        } else if (args.email) {
          query.email = args.email.trim();
        } else if (args.name) {
          query.name = { $regex: new RegExp(args.name.trim(), "i") };
        } else {
          query._id = context.userId;
        }
        const user = yield User_1.default.findOne(query).select("-password");
        if (!user) return { toolResult: { error: "User not found." } };
        return { toolResult: { user } };
      }
      case "propose_create_user":
      case "admin_propose_create_user": {
        if (!context.isAdmin) {
          return {
            toolResult: {
              error:
                "ACCESS DENIED: Administrator privileges are required to create new users.",
            },
          };
        }
        const name = String(args.name || "").trim();
        if (!name) {
          return { toolResult: { error: "User name is required." } };
        }
        const rawPic =
          (_s =
            (_r =
              (_q =
                (_p =
                  (_o =
                    (_m = args.profilePicture) !== null && _m !== void 0
                      ? _m
                      : args.image) !== null && _o !== void 0
                    ? _o
                    : args.imageUrl) !== null && _p !== void 0
                  ? _p
                  : args.avatar) !== null && _q !== void 0
                ? _q
                : args.avatarUrl) !== null && _r !== void 0
              ? _r
              : args.logo) !== null && _s !== void 0
            ? _s
            : args.logoUrl;
        const profilePicture = typeof rawPic === "string" ? rawPic.trim() : "";
        if (
          profilePicture &&
          !/^(https?:\/\/|\/|data:image\/)/i.test(profilePicture)
        ) {
          return {
            toolResult: {
              error:
                "Invalid profile picture URL. Please provide a valid http/https image URL.",
            },
          };
        }
        const cleanEmail =
          args.email && String(args.email).trim()
            ? String(args.email).trim()
            : `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}${Math.floor(100 + Math.random() * 900)}@example.com`;
        const cleanPhone =
          args.phone && String(args.phone).trim()
            ? String(args.phone).trim()
            : `+919${Math.floor(100000000 + Math.random() * 900000000)}`;
        const proposal = {
          proposalId: `prop_${(0, uuid_1.v4)()}`,
          module: "USER",
          actionType: "CREATE",
          items: [
            {
              name,
              email: cleanEmail,
              password: String(args.password || "Password@123").trim(),
              phone: cleanPhone,
              profilePicture,
              bio: String(args.bio || "").trim(),
              isAdmin: Boolean(args.isAdmin),
            },
          ],
          summary: `Create User: "${name}" (${cleanEmail})${profilePicture ? " (with profile picture)" : ""}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_update_user":
      case "admin_propose_update_user": {
        let targetUser = null;
        if (args.targetUserId && /^[0-9a-fA-F]{24}$/.test(args.targetUserId)) {
          targetUser = yield User_1.default.findById(args.targetUserId);
        } else if (args.searchEmail || args.email) {
          const emailLookup = (args.searchEmail || args.email).trim();
          targetUser = yield User_1.default.findOne({
            email: {
              $regex: new RegExp(
                `^${emailLookup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                "i",
              ),
            },
          });
        }
        if (!targetUser) {
          const nameLookup = String(
            args.searchName || args.userName || args.name || "",
          ).trim();
          if (nameLookup) {
            targetUser = yield User_1.default.findOne({
              name: {
                $regex: new RegExp(
                  nameLookup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                  "i",
                ),
              },
            });
          }
        }
        // If user says "update my profile picture to https://..." without naming anyone, target current user
        if (
          !targetUser &&
          !args.targetUserId &&
          !args.searchName &&
          !args.userName &&
          !args.searchEmail
        ) {
          targetUser = yield User_1.default.findById(context.userId);
        }
        if (!targetUser) {
          return { toolResult: { error: "Target user not found." } };
        }
        if (!context.isAdmin && targetUser._id.toString() !== context.userId) {
          return {
            toolResult: {
              error:
                "ACCESS DENIED: Administrator privileges are required to update other users.",
            },
          };
        }
        if (
          context.isAdmin &&
          targetUser.isAdmin &&
          targetUser._id.toString() !== context.userId &&
          args.isAdmin === false
        ) {
          return {
            toolResult: {
              error: `Security Rule: "${targetUser.name}" is also an admin, so demoting their admin status is restricted.`,
            },
          };
        }
        const rawPic =
          (_y =
            (_x =
              (_w =
                (_v =
                  (_u =
                    (_t = args.profilePicture) !== null && _t !== void 0
                      ? _t
                      : args.image) !== null && _u !== void 0
                    ? _u
                    : args.imageUrl) !== null && _v !== void 0
                  ? _v
                  : args.avatar) !== null && _w !== void 0
                ? _w
                : args.avatarUrl) !== null && _x !== void 0
              ? _x
              : args.logo) !== null && _y !== void 0
            ? _y
            : args.logoUrl;
        if (typeof rawPic === "string" && rawPic.trim()) {
          const cleanPic = rawPic.trim();
          if (!/^(https?:\/\/|\/|data:image\/)/i.test(cleanPic)) {
            return {
              toolResult: {
                error:
                  "Invalid profile picture URL. Please provide a valid http/https image URL.",
              },
            };
          }
        }
        const updates = {};
        if (
          typeof args.name === "string" &&
          args.name.trim() &&
          (args.searchName ||
            args.userName ||
            args.targetUserId ||
            args.name.trim() !== targetUser.name)
        ) {
          updates.name = args.name.trim();
        }
        if (args.email && args.email.trim() !== targetUser.email)
          updates.email = args.email.trim();
        if (args.phone) updates.phone = args.phone.trim();
        if (typeof args.bio === "string") updates.bio = args.bio;
        if (typeof args.isAdmin === "boolean" && context.isAdmin)
          updates.isAdmin = args.isAdmin;
        if (typeof rawPic === "string") updates.profilePicture = rawPic.trim();
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
                phone: targetUser.phone,
                profilePicture: targetUser.profilePicture || "",
                bio: targetUser.bio || "",
                isAdmin: targetUser.isAdmin,
              },
              updates,
            },
          ],
          summary: `Update User: "${targetUser.name}"${updates.profilePicture !== undefined ? " (profile picture updated)" : ""}`,
          isDestructive: false,
        };
        stageProposal(context.userId, proposal);
        return {
          toolResult: {
            status: "STAGED",
            proposalId: proposal.proposalId,
            summary: proposal.summary,
          },
          proposal,
        };
      }
      case "propose_delete_user":
      case "admin_propose_delete_user": {
        if (!context.isAdmin) {
          return {
            toolResult: {
              error:
                "ACCESS DENIED: Administrator privileges are required to delete users.",
            },
          };
        }
        let targetUser = null;
        if (args.targetUserId && /^[0-9a-fA-F]{24}$/.test(args.targetUserId)) {
          targetUser = yield User_1.default.findById(args.targetUserId);
        } else if (args.email) {
          targetUser = yield User_1.default.findOne({
            email: args.email.trim(),
          });
        } else if (args.userName || args.name) {
          const lookup = String(args.userName || args.name).trim();
          targetUser = yield User_1.default.findOne({
            name: {
              $regex: new RegExp(
                `^${lookup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                "i",
              ),
            },
          });
        }
        if (!targetUser)
          return { toolResult: { error: "Target user not found." } };
        if (targetUser.isAdmin) {
          return {
            toolResult: {
              error: `Security Rule Violation: User "${targetUser.name}" is an administrator and cannot be deleted.`,
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
          summary: `Delete User Account: "${targetUser.name}" (${targetUser.email})`,
          isDestructive: true,
        };
        stageProposal(context.userId, proposal);
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
       * ─── 5. EXECUTION DISPATCHER (WRITES TO MONGODB) ──────────
       */
      case "execute_proposal": {
        const { proposalId, confirmed } = args;
        if (!confirmed) {
          return { toolResult: { error: "Execution cancelled by user." } };
        }
        // Resolve by exact proposalId, OR fallback to the user's latest active proposal
        let targetProposalId = proposalId;
        let entry = targetProposalId
          ? pendingProposals.get(targetProposalId)
          : undefined;
        if (!entry) {
          const latestId = latestProposalByUser.get(context.userId);
          if (latestId) {
            targetProposalId = latestId;
            entry = pendingProposals.get(latestId);
          }
        }
        if (!entry || !targetProposalId) {
          return {
            toolResult: {
              error:
                "No active pending proposal found. Please tell me what you would like to create, update, or delete.",
            },
          };
        }
        if (entry.userId !== context.userId) {
          return {
            toolResult: {
              error: "Unauthorized: You do not own this proposal.",
            },
          };
        }
        const { proposal } = entry;
        console.log(
          `[AI Executing] ${proposal.module} ${proposal.actionType}:`,
          proposal.items,
        );
        let updatedUserDoc = null;
        // ── EXECUTE TODO MUTATIONS ──
        if (proposal.module === "TODO") {
          if (proposal.actionType === "CREATE") {
            const docs = proposal.items.map((i) => ({
              title: i.title,
              description: i.description,
              urgency: i.urgency,
              deadline: i.deadline,
              isCompleted: false,
              userId: context.userId,
            }));
            yield Todo_1.default.insertMany(docs);
          } else if (proposal.actionType === "UPDATE") {
            for (const item of proposal.items) {
              yield Todo_1.default.findOneAndUpdate(
                { _id: item.todoId, userId: context.userId },
                item.updates,
                { new: true },
              );
            }
          } else if (proposal.actionType === "DELETE") {
            for (const item of proposal.items) {
              yield Todo_1.default.findOneAndDelete({
                _id: item.todoId,
                userId: context.userId,
              });
            }
          }
        }
        // ── EXECUTE TOOL MUTATIONS ──
        if (proposal.module === "TOOL") {
          if (proposal.actionType === "CREATE") {
            for (const item of proposal.items) {
              yield Tool_1.default.create(
                Object.assign(Object.assign({}, item), {
                  userId: context.userId,
                }),
              );
            }
          } else if (proposal.actionType === "UPDATE") {
            for (const item of proposal.items) {
              yield Tool_1.default.findOneAndUpdate(
                { _id: item.toolId, userId: context.userId },
                item.updates,
                { new: true },
              );
            }
          } else if (proposal.actionType === "DELETE") {
            for (const item of proposal.items) {
              yield Tool_1.default.findOneAndDelete({
                _id: item.toolId,
                userId: context.userId,
              });
            }
          }
        }
        // ── EXECUTE QA MUTATIONS ──
        if (proposal.module === "QA") {
          if (proposal.actionType === "CREATE") {
            const docs = proposal.items.map((i) => ({
              question: i.question,
              answer: i.answer,
              importance: i.importance,
              toolId: i.toolId,
              userId: context.userId,
            }));
            yield Qa_1.default.insertMany(docs);
          } else if (proposal.actionType === "UPDATE") {
            for (const item of proposal.items) {
              yield Qa_1.default.findOneAndUpdate(
                { _id: item.qaId, userId: context.userId },
                item.updates,
                { new: true },
              );
            }
          } else if (proposal.actionType === "DELETE") {
            for (const item of proposal.items) {
              yield Qa_1.default.findOneAndDelete({
                _id: item.qaId,
                userId: context.userId,
              });
            }
          }
        }
        // ── EXECUTE USER MUTATIONS ──
        if (proposal.module === "USER") {
          if (proposal.actionType === "CREATE" && context.isAdmin) {
            for (const item of proposal.items) {
              const hashedPassword = bcryptjs_1.default.hashSync(
                item.password || "Password@123",
                10,
              );
              yield User_1.default.create({
                name: item.name,
                email: item.email,
                password: hashedPassword,
                phone: item.phone,
                profilePicture: item.profilePicture || "",
                bio: item.bio || "",
                isAdmin: Boolean(item.isAdmin),
              });
            }
          } else if (proposal.actionType === "UPDATE") {
            for (const item of proposal.items) {
              if (context.isAdmin || item.targetUserId === context.userId) {
                updatedUserDoc = yield User_1.default
                  .findByIdAndUpdate(item.targetUserId, item.updates, {
                    new: true,
                  })
                  .select("-password");
              }
            }
          } else if (proposal.actionType === "DELETE" && context.isAdmin) {
            for (const item of proposal.items) {
              yield User_1.default.findByIdAndDelete(item.targetUserId);
            }
          }
        }
        // Clean up executed proposal
        pendingProposals.delete(targetProposalId);
        if (latestProposalByUser.get(context.userId) === targetProposalId) {
          latestProposalByUser.delete(context.userId);
        }
        console.log(`[AI Executed Successfully] ${proposal.summary}`);
        return {
          toolResult: {
            status: "EXECUTED",
            message: `Successfully executed: ${proposal.summary}. Database updated.`,
            module: proposal.module,
            updatedUser: updatedUserDoc
              ? ((_a = updatedUserDoc.toObject) === null || _a === void 0
                  ? void 0
                  : _a.call(updatedUserDoc)) || updatedUserDoc
              : undefined,
          },
          executed: true,
          executedModule: proposal.module,
        };
      }
      default:
        return { toolResult: { error: `Unrecognized tool: ${toolName}` } };
    }
  });
}
