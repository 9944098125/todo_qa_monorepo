"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableTools = getAvailableTools;
/**
 * 1. TODO TOOLS
 */
const todoTools = [
  {
    type: "function",
    function: {
      name: "list_todo_items",
      description:
        "List, search, or filter the authenticated user's Todo tasks by completion status, urgency, keyword, or deadline dates (overdue, passed deadlines, or due within a timeframe).",
      parameters: {
        type: "object",
        properties: {
          isCompleted: {
            type: "boolean",
            description:
              "Filter by completion status: false for pending tasks, true for completed tasks.",
          },
          urgency: {
            type: "boolean",
            description:
              "Filter by urgency: true for urgent tasks, false for regular.",
          },
          overdue: {
            type: "boolean",
            description:
              "If true, returns only uncompleted (pending) tasks whose deadline has already passed.",
          },
          deadlineBefore: {
            type: "string",
            description:
              "ISO 8601 date string (e.g. '2026-11-22T23:59:59.999Z'). Returns tasks with a deadline on or before this timestamp.",
          },
          deadlineAfter: {
            type: "string",
            description:
              "ISO 8601 date string (e.g. '2026-11-12T00:00:00.000Z'). Returns tasks with a deadline on or after this timestamp.",
          },
          search: {
            type: "string",
            description: "Optional keyword to search in title or description.",
          },
          limit: {
            type: "number",
            description: "Maximum items to return (default 30, max 50).",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_todos",
      description:
        "Propose creating one or more Todo items. Generates a staged proposal for user confirmation.",
      parameters: {
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "List of Todo tasks to create.",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Clear, concise task title.",
                },
                description: {
                  type: "string",
                  description: "Task description or details.",
                },
                urgency: { type: "boolean", default: false },
                deadline: {
                  type: "string",
                  description:
                    "ISO 8601 string representing the deadline (e.g. '2026-11-20T18:00:00.000Z').",
                },
              },
              required: ["title", "description", "deadline"],
            },
          },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_todo",
      description:
        "Propose updating fields of an existing Todo item. Can lookup by todoId or searchTitle.",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The MongoDB ObjectId if known.",
          },
          searchTitle: {
            type: "string",
            description: "Title of the task to update if todoId is unknown.",
          },
          title: { type: "string" },
          description: { type: "string" },
          urgency: { type: "boolean" },
          deadline: { type: "string" },
          isCompleted: {
            type: "boolean",
            description: "Mark as completed (true) or pending (false).",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_todo",
      description:
        "Propose deleting a specific Todo item by its ID or by its title. Requires confirmation.",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The MongoDB ObjectId if known.",
          },
          title: {
            type: "string",
            description: "Title of the task to delete if todoId is unknown.",
          },
        },
      },
    },
  },
];
/**
 * 2. TOOL / CATEGORY TOOLS
 */
const toolCategoryTools = [
  {
    type: "function",
    function: {
      name: "list_user_tools",
      description:
        "Retrieve all Tool categories created by the authenticated user.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_tool",
      description:
        "Propose creating a new Tool category for organizing QA items.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          slug: { type: "string" },
          color: { type: "string", default: "#3b82f6" },
          description: { type: "string" },
        },
        required: ["name", "slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_tool",
      description: "Propose updating an existing Tool category.",
      parameters: {
        type: "object",
        properties: {
          toolId: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          color: { type: "string" },
          description: { type: "string" },
        },
        required: ["toolId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_tool",
      description: "Propose deleting a Tool category by ID or name.",
      parameters: {
        type: "object",
        properties: {
          toolId: { type: "string" },
          name: { type: "string" },
        },
      },
    },
  },
];
/**
 * 3. QA KNOWLEDGE BASE TOOLS
 */
const qaTools = [
  {
    type: "function",
    function: {
      name: "list_qa_items",
      description: "Query Question & Answer knowledge base records.",
      parameters: {
        type: "object",
        properties: {
          toolId: { type: "string" },
          importance: {
            type: "string",
            enum: ["Important", "Very Important", "Not Important"],
          },
          search: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_qa",
      description: "Propose creating QA items under a specific Tool category.",
      parameters: {
        type: "object",
        properties: {
          toolId: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
                importance: {
                  type: "string",
                  enum: ["Important", "Very Important", "Not Important"],
                },
              },
              required: ["question", "answer"],
            },
          },
        },
        required: ["toolId", "items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_qa",
      description: "Propose updating an existing QA item.",
      parameters: {
        type: "object",
        properties: {
          qaId: { type: "string" },
          question: { type: "string" },
          answer: { type: "string" },
          importance: {
            type: "string",
            enum: ["Important", "Very Important", "Not Important"],
          },
        },
        required: ["qaId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_qa",
      description: "Propose deleting a QA item.",
      parameters: {
        type: "object",
        properties: {
          qaId: { type: "string" },
          questionSummary: { type: "string" },
        },
      },
    },
  },
];
/**
 * 4. ADMIN USER TOOLS
 */
const adminUserTools = [
  {
    type: "function",
    function: {
      name: "admin_list_users",
      description: "ADMIN ONLY: List registered users in the application.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", default: 10 },
          search: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "admin_get_user",
      description: "ADMIN ONLY: Get full account details of a specific user.",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string" },
          email: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "admin_propose_create_user",
      description: "ADMIN ONLY: Propose creating a new user account.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          phone: { type: "string" },
          bio: { type: "string" },
          isAdmin: { type: "boolean", default: false },
        },
        required: ["name", "email", "password", "phone"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "admin_propose_update_user",
      description: "ADMIN ONLY: Propose updating a user's details.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          bio: { type: "string" },
          isAdmin: { type: "boolean" },
        },
        required: ["targetUserId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "admin_propose_delete_user",
      description: "ADMIN ONLY: Propose deleting a user account.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: { type: "string" },
          userName: { type: "string" },
        },
        required: ["targetUserId"],
      },
    },
  },
];
/**
 * 5. EXECUTION TOOL (Connects Proposals to MongoDB)
 */
const executionTools = [
  {
    type: "function",
    function: {
      name: "execute_proposal",
      description:
        "Execute the user's pending proposal (create, update, or delete) after they confirm in chat. Commits changes directly to MongoDB.",
      parameters: {
        type: "object",
        properties: {
          proposalId: {
            type: "string",
            description:
              "Optional proposal ID. If omitted, executes the user's most recent pending proposal.",
          },
          confirmed: {
            type: "boolean",
            description: "Must be true to execute.",
          },
        },
        required: ["confirmed"],
      },
    },
  },
];
function getAvailableTools(isAdmin) {
  const baseTools = [
    ...todoTools,
    ...toolCategoryTools,
    ...qaTools,
    ...executionTools,
  ];
  if (isAdmin) {
    return [...baseTools, ...adminUserTools];
  }
  return baseTools;
}
