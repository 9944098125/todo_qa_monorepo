export type AiActionModule = 'TODO' | 'QA' | 'TOOL' | 'USER' | 'COMBINED';
export type AiActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LIST';

export interface AiProposedAction {
  proposalId: string;
  module: AiActionModule;
  actionType: AiActionType;
  items: any[];
  summary: string;
  isDestructive?: boolean;
}

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

/* --- RTK Query API Types --- */

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
    };
  };
  meta: {
    url: string;
  };
}
