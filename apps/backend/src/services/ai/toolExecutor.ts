import Todo from "../../models/Todo";
import Tool from "../../models/Tool";
import Qa from "../../models/Qa";
import User from "../../models/User";
import { v4 as uuidv4 } from "uuid";

export interface ToolExecutionContext {
  userId: string;
  userName: string;
  isAdmin: boolean;
}

export interface ProposalPayload {
  proposalId: string;
  module: "TODO" | "TOOL" | "QA" | "USER" | "COMBINED";
  actionType: "CREATE" | "UPDATE" | "DELETE";
  items: any[];
  summary: string;
  isDestructive: boolean;
}

export interface ToolExecutionResult {
  toolResult: any;
  proposal?: ProposalPayload;
}

/**
 * Dispatches and executes an AI tool call with strict authorization and validation.
 */
export async function executeToolCall(
  toolName: string,
  rawArgs: string,
  context: ToolExecutionContext,
): Promise<ToolExecutionResult> {
  let args: any = {};
  try {
    args = JSON.parse(rawArgs || "{}");
  } catch {
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
      const filter: any = { userId: context.userId };
      if (typeof args.urgency === "boolean") filter.urgency = args.urgency;
      if (args.search) {
        filter.$or = [
          { title: { $regex: args.search, $options: "i" } },
          { description: { $regex: args.search, $options: "i" } },
        ];
      }
      const limit = Math.min(Math.max(Number(args.limit) || 15, 1), 30);
      const todos = await Todo.find(filter)
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
      const validatedItems = items.map((item: any) => ({
        tempId: uuidv4(),
        title: String(item.title || "Untitled Task").trim(),
        description: String(item.description || "").trim(),
        urgency: Boolean(item.urgency),
        deadline:
          item.deadline || new Date(Date.now() + 86400000).toISOString(),
      }));

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const existing = await Todo.findOne({
        _id: args.todoId,
        userId: context.userId,
      });
      if (!existing) {
        return {
          toolResult: { error: `Todo with ID ${args.todoId} was not found.` },
        };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
              title: args.title ?? existing.title,
              description: args.description ?? existing.description,
              urgency:
                typeof args.urgency === "boolean"
                  ? args.urgency
                  : existing.urgency,
              deadline: args.deadline ?? existing.deadline,
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
      const existing = await Todo.findOne({
        _id: args.todoId,
        userId: context.userId,
      });
      if (!existing) {
        return {
          toolResult: { error: `Todo with ID ${args.todoId} was not found.` },
        };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const tools = await Tool.find({ userId: context.userId }).select(
        "_id name slug color description",
      );
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

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const existing = await Tool.findOne({
        _id: args.toolId,
        userId: context.userId,
      });
      if (!existing) {
        return {
          toolResult: { error: `Tool with ID ${args.toolId} was not found.` },
        };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
              name: args.name ?? existing.name,
              slug: args.slug ?? existing.slug,
              color: args.color ?? existing.color,
              description: args.description ?? existing.description,
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
      const existing = await Tool.findOne({
        _id: args.toolId,
        userId: context.userId,
      });
      if (!existing) {
        return {
          toolResult: { error: `Tool with ID ${args.toolId} was not found.` },
        };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const filter: any = { userId: context.userId };
      if (args.toolId) filter.toolId = args.toolId;
      if (args.importance) filter.importance = args.importance;
      if (args.search) {
        filter.$or = [
          { question: { $regex: args.search, $options: "i" } },
          { answer: { $regex: args.search, $options: "i" } },
        ];
      }

      const qaList = await Qa.find(filter)
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

      const targetTool = await Tool.findOne({
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

      const validatedItems = items.map((item: any) => ({
        tempId: uuidv4(),
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

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const existing = await Qa.findOne({
        _id: args.qaId,
        userId: context.userId,
      });
      if (!existing) {
        return { toolResult: { error: `QA item ${args.qaId} not found.` } };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
              question: args.question ?? existing.question,
              answer: args.answer ?? existing.answer,
              importance: args.importance ?? existing.importance,
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
      const existing = await Qa.findOne({
        _id: args.qaId,
        userId: context.userId,
      });
      if (!existing) {
        return { toolResult: { error: `QA item ${args.qaId} not found.` } };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
        module: "QA",
        actionType: "DELETE",
        items: [{ qaId: existing._id.toString(), question: existing.question }],
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
      const filter: any = {};
      if (args.search) {
        filter.$or = [
          { name: { $regex: args.search, $options: "i" } },
          { email: { $regex: args.search, $options: "i" } },
          { phone: { $regex: args.search, $options: "i" } },
        ];
      }
      const users = await User.find(filter)
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
      const query: any = {};
      if (args.userId) query._id = args.userId;
      else if (args.email) query.email = args.email;
      else
        return { toolResult: { error: "Either userId or email is required." } };

      const user = await User.findOne(query).select("-password");
      if (!user) return { toolResult: { error: "User not found." } };

      return { toolResult: { user } };
    }

    case "admin_propose_create_user": {
      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
      const targetUser = await User.findById(args.targetUserId);
      if (!targetUser)
        return { toolResult: { error: "Target user not found." } };

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
              name: args.name ?? targetUser.name,
              email: args.email ?? targetUser.email,
              phone: args.phone ?? targetUser.phone,
              bio: args.bio ?? targetUser.bio,
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
      const targetUser = await User.findById(args.targetUserId);
      if (!targetUser)
        return { toolResult: { error: "Target user not found." } };

      if (targetUser.isAdmin) {
        return {
          toolResult: {
            error: `Security Rule Violation: User "${targetUser.name}" is an administrator. Admin accounts cannot be deleted.`,
          },
        };
      }

      const proposal: ProposalPayload = {
        proposalId: `prop_${uuidv4()}`,
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
}
