import OpenAI from "openai";

/**
 * 1. TODO TOOLS
 */
const todoTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_todo_items",
      description:
        "List or search the authenticated user's existing Todo tasks. Supports filtering by urgency or keyword.",
      parameters: {
        type: "object",
        properties: {
          urgency: {
            type: "boolean",
            description:
              "Filter by urgency: true for urgent tasks, false for regular.",
          },
          search: {
            type: "string",
            description: "Optional keyword to search in title or description.",
          },
          limit: {
            type: "number",
            description: "Maximum items to return (default 15, max 30).",
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
        "Propose creating one or more Todo items. Generates a staged proposal for user review and confirmation.",
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
                  description: "Helpful task description or steps.",
                },
                urgency: {
                  type: "boolean",
                  description:
                    "True for urgent/high-priority tasks, false otherwise.",
                  default: false,
                },
                deadline: {
                  type: "string",
                  description:
                    "Strict ISO 8601 string representing the deadline (e.g. '2026-11-20T18:00:00.000Z').",
                },
              },
              required: ["title", "description", "deadline"],
            },
          },
        },
        required: ["items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_todo",
      description:
        "Propose updating fields of an existing Todo item (title, description, urgency, deadline).",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The 24-character MongoDB ObjectId of the Todo.",
          },
          title: { type: "string" },
          description: { type: "string" },
          urgency: { type: "boolean" },
          deadline: {
            type: "string",
            description: "ISO 8601 deadline string.",
          },
        },
        required: ["todoId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_todo",
      description:
        "Propose deleting a specific Todo item. Requires user confirmation.",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The 24-character MongoDB ObjectId of the Todo.",
          },
          title: {
            type: "string",
            description:
              "Title of the task being deleted for confirmation display.",
          },
        },
        required: ["todoId"],
      },
    },
  },
];

/**
 * 2. TOOL / CATEGORY TOOLS
 */
const toolCategoryTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_user_tools",
      description:
        "Retrieve all Tool categories created by the authenticated user (e.g., React, NodeJS, Docker).",
      parameters: {
        type: "object",
        properties: {},
      },
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
          name: {
            type: "string",
            description: "Name of the category (e.g. 'Docker', 'GraphQL').",
          },
          slug: {
            type: "string",
            description:
              "URL-friendly lowercase slug (e.g. 'docker', 'graphql').",
          },
          color: {
            type: "string",
            description: "Hex color code (e.g. '#3b82f6', '#ef4444').",
          },
          description: {
            type: "string",
            description: "Brief description of the category.",
          },
        },
        required: ["name", "slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_tool",
      description:
        "Propose updating an existing Tool category's name, color, or description.",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "MongoDB ObjectId of the tool category.",
          },
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
      description:
        "Propose deleting a Tool category. Destructive action requiring user confirmation.",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "MongoDB ObjectId of the tool category to delete.",
          },
          name: {
            type: "string",
            description: "Name of the category for confirmation display.",
          },
        },
        required: ["toolId"],
      },
    },
  },
];

/**
 * 3. QA KNOWLEDGE BASE TOOLS
 */
const qaTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_qa_items",
      description:
        "Query the user's Question & Answer knowledge base records across one or all categories.",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "Optional: filter by a specific Tool/Category ID.",
          },
          importance: {
            type: "string",
            enum: ["Important", "Very Important", "Not Important"],
            description: "Filter by importance level.",
          },
          search: {
            type: "string",
            description: "Keyword to search in questions or answers.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_qa",
      description:
        "Propose creating one or more QA items under a specific Tool category.",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "The target Tool/Category ObjectId.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The question or scenario.",
                },
                answer: {
                  type: "string",
                  description: "Detailed formatted answer or explanation.",
                },
                importance: {
                  type: "string",
                  enum: ["Important", "Very Important", "Not Important"],
                  default: "Important",
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
      description:
        "Propose updating an existing QA item's question, answer, or importance.",
      parameters: {
        type: "object",
        properties: {
          qaId: {
            type: "string",
            description: "MongoDB ObjectId of the QA item.",
          },
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
      description: "Propose deleting a QA item. Requires user confirmation.",
      parameters: {
        type: "object",
        properties: {
          qaId: {
            type: "string",
            description: "MongoDB ObjectId of the QA item.",
          },
          questionSummary: {
            type: "string",
            description: "Summary of question being deleted.",
          },
        },
        required: ["qaId"],
      },
    },
  },
];

/**
 * 4. ADMIN USER TOOLS (Strictly for isAdmin = true)
 */
const adminUserTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "admin_list_users",
      description:
        "ADMIN ONLY: List registered users in the application with pagination.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", default: 10 },
          search: {
            type: "string",
            description: "Filter by name, email, or phone.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "admin_get_user",
      description:
        "ADMIN ONLY: Get full account details of a specific user by ID or email.",
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
      description:
        "ADMIN ONLY: Propose creating a new user account with credentials and roles.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: {
            type: "string",
            description: "Temporary or assigned password.",
          },
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
      description:
        "ADMIN ONLY: Propose updating a user's profile, bio, or admin status.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: {
            type: "string",
            description: "ObjectId of the user to update.",
          },
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
      description:
        "ADMIN ONLY: Propose deleting a user account. Requires confirmation.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: {
            type: "string",
            description: "ObjectId of user to delete.",
          },
          userName: {
            type: "string",
            description: "Name of user for confirmation display.",
          },
        },
        required: ["targetUserId"],
      },
    },
  },
];

/**
 * Dynamically exports the authorized tool catalog based on user role.
 * Non-admins never receive admin user tools in their schema.
 */
export function getAvailableTools(
  isAdmin: boolean,
): OpenAI.ChatCompletionTool[] {
  const baseTools = [...todoTools, ...toolCategoryTools, ...qaTools];
  if (isAdmin) {
    return [...baseTools, ...adminUserTools];
  }
  return baseTools;
}
