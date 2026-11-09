export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  // Future phases will attach proposal data here:
  proposal?: any;
}

export interface AiState {
  isDrawerOpen: boolean;
  messages: AiChatMessage[];
  isLoading: boolean;
  error: string | null;
}
