// apps/frontend/src/app/components/AiAssistant/slice/types.ts

export type AiActionModule = 'TODO' | 'TOOL' | 'QA' | 'USER' | 'COMBINED';
export type AiActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LIST';

/* ─── 1. DOMAIN SPECIFIC PROPOSED ITEMS ─── */

/**
 * Proposed item for Todo operations (Create / Update / Delete)
 */
export interface ProposedTodoItem {
  tempId?: string;
  todoId?: string;
  title: string;
  description: string;
  urgency: boolean;
  deadline: string; // ISO 8601 date string e.g. "2026-11-20T18:00:00.000Z"
  original?: {
    title: string;
    description: string;
    urgency: boolean;
    deadline: string;
  };
  updates?: Partial<ProposedTodoItem>;
}

/**
 * Proposed item for Tool/Category operations
 */
export interface ProposedToolItem {
  toolId?: string;
  name: string;
  slug: string;
  color: string; // Hex color code e.g. "#3b82f6"
  description?: string;
  original?: {
    name: string;
    slug: string;
    color: string;
  };
  updates?: Partial<ProposedToolItem>;
}

/**
 * Proposed item for QA Knowledge items
 */
export interface ProposedQaItem {
  tempId?: string;
  qaId?: string;
  toolId: string;
  toolName?: string;
  question: string;
  answer: string;
  importance: 'Important' | 'Very Important' | 'Not Important';
  original?: {
    question: string;
    answer: string;
    importance: string;
  };
  updates?: Partial<ProposedQaItem>;
}

/**
 * Proposed item for Admin User Management
 */
export interface ProposedUserItem {
  targetUserId?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  bio?: string;
  isAdmin: boolean;
  original?: {
    name: string;
    email: string;
    isAdmin?: boolean;
  };
  updates?: Partial<ProposedUserItem>;
}

/**
 * Union of all supported proposal items
 */
export type ProposedItem =
  ProposedTodoItem | ProposedToolItem | ProposedQaItem | ProposedUserItem;

/* ─── 2. MASTER PROPOSAL CONTRACT ─── */

export interface AiProposedAction<T = ProposedItem> {
  proposalId: string;
  module: AiActionModule;
  actionType: AiActionType;
  items: T[];
  summary: string;
  isDestructive: boolean;
}

/* ─── 3. CHAT MESSAGE & REDUX STATE ─── */

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  proposal?: AiProposedAction;
}

export interface AiState {
  isDrawerOpen: boolean;
  messages: AiChatMessage[];
  isLoading: boolean;
  error: string | null;
}

/* ─── 4. API CONTRACTS (RTK QUERY) ─── */

export interface AiChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AiChatResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      message: string;
      model: string;
      isAdmin: boolean;
      /** Strongly-typed proposal (null for informational/read queries) */
      proposal: AiProposedAction | null;
    };
  };
  meta: {
    url: string;
  };
}
