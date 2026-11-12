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
const toolCategoryTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_user_tools",
      description:
        "Retrieve all Tool categories created by the authenticated user, including their name, slug, color, description, and logo image URL.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_tool",
      description:
        "Propose creating a new Tool category for organizing QA items, optionally including a logo/image URL.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Display name of the tool." },
          slug: {
            type: "string",
            description: "URL-friendly lowercase slug (e.g. 'docker').",
          },
          color: { type: "string", default: "#3b82f6" },
          description: { type: "string" },
          image: {
            type: "string",
            description:
              "Optional logo or image URL for the tool (e.g. 'https://example.com/logo.png').",
          },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_tool",
      description:
        "Propose updating an existing Tool category (including name, slug, color, description, or logo/image URL). Can lookup by toolId or searchName.",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "The MongoDB ObjectId of the tool if known.",
          },
          searchName: {
            type: "string",
            description:
              "Current name of the tool to update if toolId is unknown.",
          },
          name: {
            type: "string",
            description: "New display name for the tool.",
          },
          slug: {
            type: "string",
            description: "New lowercase slug for the tool.",
          },
          color: { type: "string", description: "New hex color code." },
          description: { type: "string", description: "New description." },
          image: {
            type: "string",
            description:
              "New logo or image URL for the tool (e.g. 'https://example.com/logo.png').",
          },
        },
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
const qaTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_qa_items",
      description:
        "Query Question & Answer knowledge base records. Supports filtering by tool/category, importance level ('all', 'Very Important', 'Important', 'Not Important'), keyword search, and sorting ('new-to-old' or 'old-to-new').",
      parameters: {
        type: "object",
        properties: {
          toolId: {
            type: "string",
            description: "Optional Tool/Category ObjectId.",
          },
          toolName: {
            type: "string",
            description:
              "Optional Tool/Category name (e.g. 'React', 'Docker') if toolId is unknown.",
          },
          importance: {
            type: "string",
            enum: ["all", "Important", "Very Important", "Not Important"],
            description:
              "Filter by importance level. Use 'all' or omit for all importance levels.",
          },
          sort: {
            type: "string",
            enum: ["new-to-old", "old-to-new"],
            description:
              "Sort order by creation date: 'new-to-old' (newest first, default) or 'old-to-new' (oldest first).",
          },
          search: {
            type: "string",
            description: "Keyword to search in question or answer.",
          },
          limit: {
            type: "number",
            description: "Maximum QA items to return (default 20, max 50).",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_qa_filters",
      description:
        "Update the active sort order ('new-to-old' or 'old-to-new') and/or importance filter ('all', 'Important', 'Very Important', 'Not Important') on the QA page UI.",
      parameters: {
        type: "object",
        properties: {
          sort: {
            type: "string",
            enum: ["new-to-old", "old-to-new"],
            description: "Sort order to apply on the QA page.",
          },
          importance: {
            type: "string",
            enum: ["all", "Important", "Very Important", "Not Important"],
            description: "Importance filter to apply on the QA page.",
          },
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
 * 4. USER MANAGEMENT & PROFILE TOOLS
 */
const userTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_my_profile",
      description:
        "Get the authenticated user's own profile details (name, email, phone, bio, profilePicture) as displayed on the Profile tab.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_my_profile",
      description:
        "Propose updating the authenticated user's own profile on the Profile tab (name, email, phone, bio, or profilePicture image URL). Generates a staged proposal for user confirmation.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "New display name." },
          email: { type: "string", description: "New email address." },
          phone: { type: "string", description: "New phone number." },
          bio: { type: "string", description: "New bio text." },
          profilePicture: {
            type: "string",
            description:
              "New profile picture image URL (e.g. 'https://example.com/avatar.jpg').",
          },
          image: {
            type: "string",
            description: "Alias for profilePicture image URL.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_users",
      description:
        "List or search registered users in the application, returning their names, emails, phones, profile pictures, and admin roles.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Optional keyword to search in name or email.",
          },
          limit: {
            type: "number",
            description: "Maximum users to return (default 10, max 50).",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_details",
      description:
        "Get account details of a specific user by userId, email, or name.",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "MongoDB ObjectId." },
          email: { type: "string", description: "User email address." },
          name: { type: "string", description: "User name." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_user",
      description:
        "Propose creating a new user account with details and an optional profile picture / avatar image URL.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Full name of the user." },
          email: {
            type: "string",
            description: "Email address of the user.",
          },
          profilePicture: {
            type: "string",
            description:
              "Optional profile picture or avatar image URL (e.g. 'https://example.com/avatar.jpg').",
          },
          image: {
            type: "string",
            description: "Alias for profilePicture image URL.",
          },
          phone: {
            type: "string",
            description: "Phone number (e.g. '+919876543210').",
          },
          password: {
            type: "string",
            description:
              "Account password (defaults to 'Password@123' if omitted).",
          },
          bio: { type: "string", description: "User biography." },
          isAdmin: {
            type: "boolean",
            description:
              "Whether this user has admin role (defaults to false).",
          },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_user",
      description:
        "Propose updating an existing user's details, including their profile picture / avatar image URL. Can lookup by targetUserId, searchName, or searchEmail.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: {
            type: "string",
            description: "The MongoDB ObjectId of the user if known.",
          },
          searchName: {
            type: "string",
            description: "Name of the user to update (e.g. 'John').",
          },
          searchEmail: {
            type: "string",
            description:
              "Email of the user to update (e.g. 'john@example.com').",
          },
          name: { type: "string", description: "New name for the user." },
          email: { type: "string", description: "New email for the user." },
          profilePicture: {
            type: "string",
            description:
              "New profile picture or avatar image URL (e.g. 'https://example.com/avatar.jpg').",
          },
          image: {
            type: "string",
            description: "Alias for profilePicture image URL.",
          },
          phone: { type: "string", description: "New phone number." },
          bio: { type: "string", description: "New bio text." },
          isAdmin: { type: "boolean", description: "Update admin status." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_user",
      description:
        "Propose deleting a user account by targetUserId, email, or userName. Requires user confirmation.",
      parameters: {
        type: "object",
        properties: {
          targetUserId: {
            type: "string",
            description: "The MongoDB ObjectId of the user if known.",
          },
          userName: {
            type: "string",
            description: "Name of the user to delete.",
          },
          email: {
            type: "string",
            description: "Email of the user to delete.",
          },
        },
      },
    },
  },
];

/**
 * 5. EXECUTION TOOL (Connects Proposals to MongoDB)
 */
const executionTools: OpenAI.ChatCompletionTool[] = [
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

const uiTools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "set_theme",
      description:
        "Change or toggle the UI application theme between light mode and dark mode.",
      parameters: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            enum: ["light", "dark", "toggle"],
            description:
              "The target theme ('light', 'dark') or 'toggle' to flip the current theme.",
          },
        },
        required: ["theme"],
      },
    },
  },
];

export function getAvailableTools(
  isAdmin: boolean,
): OpenAI.ChatCompletionTool[] {
  return [
    ...todoTools,
    ...toolCategoryTools,
    ...qaTools,
    ...userTools,
    ...uiTools,
    ...executionTools,
  ];
}
