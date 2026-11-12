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
      /**
       * ─── ADMIN USER DOMAIN ────────────────────────────────────
       */
      case "admin_list_users": {
        const filter = {};
        if (args.search) {
          filter.$or = [
            { name: { $regex: args.search, $options: "i" } },
            { email: { $regex: args.search, $options: "i" } },
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
          } else if (proposal.actionType === "DELETE") {
            for (const item of proposal.items) {
              yield Qa_1.default.findOneAndDelete({
                _id: item.qaId,
                userId: context.userId,
              });
            }
          }
        }
        // ── EXECUTE USER MUTATIONS (ADMIN) ──
        if (proposal.module === "USER" && context.isAdmin) {
          if (proposal.actionType === "CREATE") {
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
                bio: item.bio,
                isAdmin: Boolean(item.isAdmin),
              });
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
