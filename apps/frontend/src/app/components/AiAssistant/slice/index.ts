import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, endpoints, formatErrors } from 'utils/api/endpoints';
import { AiChatMessage, AiChatRequest, AiChatResponse, AiState } from './types';

export const initialState: AiState = {
  isDrawerOpen: false,
  messages: [],
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'aiSlice',
  initialState,
  reducers: {
    toggleDrawer(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
    addMessage(state, action: PayloadAction<AiChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

/**
 * RTK Query API for the AI Assistant.
 * Uses `baseQuery` (without the artificial 3-second delay) for responsive chat interactions.
 */
export const api = createApi({
  reducerPath: 'aiApi',
  baseQuery,
  endpoints: build => ({
    sendChatMessage: build.mutation<AiChatResponse, AiChatRequest>({
      query: body => ({
        ...endpoints.aiChat,
        body,
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: aiActions } = slice;

export const useAiSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
