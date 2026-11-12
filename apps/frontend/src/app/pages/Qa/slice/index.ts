import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import {
  CreateQaRequest,
  CreateQaResponse,
  DeleteToolRequest,
  DeleteToolResponse,
  GenerateAnswerRequest,
  GenerateAnswerResponse,
  GetQaRequest,
  GetQaResponse,
  GetToolByIdRequest,
  GetToolByIdResponse,
  GetToolsResponse,
  QaSortOrder,
  QaState,
  ToolRequest,
  ToolResponse,
  UpdateToolRequest,
  UpdateToolResponse,
} from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQueryWithDelay,
} from 'utils/api/endpoints';

export const initialState: QaState = {
  data: null,
  error: null,
  isLoading: false,
  sortOrder: 'new-to-old',
  importanceFilter: 'all',
  editableTool: null,
  editableQa: null,
};

const slice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    // required functions
    setSortOrder(state, action: PayloadAction<QaSortOrder>) {
      state.sortOrder = action.payload;
    },
    setImportanceFilter(state, action: PayloadAction<string>) {
      state.importanceFilter = action.payload;
    },
    editTool(state, action: PayloadAction<any>) {
      state.editableTool = {
        ...action.payload,
      };
    },
    resetEditableTool(state) {
      state.editableTool = null;
    },
    editQa(state, action: PayloadAction<any>) {
      state.editableQa = {
        ...action.payload,
      };
    },
    resetEditableQa(state) {
      state.editableQa = null;
    },
  },
});

const buildQaToolQuery = (
  endpoint: { url: string; method: string },
  requestParams: GetQaRequest,
) => ({
  url: `${endpoint.url}/${requestParams?.userId}/${requestParams?.toolId}`,
  method: endpoint.method,
  params: requestParams?.query,
});

export const api = createApi({
  reducerPath: 'qaApi',
  baseQuery: baseQueryWithDelay,
  tagTypes: ['Tools', 'Qa'],
  endpoints: build => ({
    createTool: build.mutation<ToolResponse, ToolRequest>({
      query: body => {
        return {
          ...endpoints.createTool,
          body,
        };
      },
      invalidatesTags: ['Tools'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getTools: build.query<GetToolsResponse, string>({
      query: userId => {
        return {
          ...endpoints.getTools,
          params: {
            userId: userId,
          },
        };
      },
      providesTags: ['Tools'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getToolById: build.query<GetToolByIdResponse, GetToolByIdRequest>({
      query: query => {
        return {
          ...endpoints.getToolById,
          params: {
            ...query,
          },
        };
      },
      providesTags: ['Tools'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updateTool: build.mutation<UpdateToolResponse, UpdateToolRequest>({
      query: ({ query, body }) => {
        return {
          ...endpoints.updateTool,
          body,
          params: {
            ...query,
          },
        };
      },
      invalidatesTags: ['Tools'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    deleteTool: build.mutation<DeleteToolResponse, DeleteToolRequest>({
      query: query => {
        return {
          ...endpoints.deleteTool,
          params: {
            ...query,
          },
        };
      },
      invalidatesTags: ['Tools'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    createQa: build.mutation<CreateQaResponse, CreateQaRequest>({
      query: body => {
        return {
          ...endpoints.createQa,
          body,
        };
      },
      invalidatesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getQaByTool: build.query<GetQaResponse, GetQaRequest>({
      query: requestParams =>
        buildQaToolQuery(endpoints.getQaByToolId, requestParams),
      providesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getQaNewToOld: build.query<GetQaResponse, GetQaRequest>({
      query: requestParams =>
        buildQaToolQuery(endpoints.getQaNewToOld, requestParams),
      providesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getQaOldToNew: build.query<GetQaResponse, GetQaRequest>({
      query: requestParams =>
        buildQaToolQuery(endpoints.getQaOldToNew, requestParams),
      providesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getQaByImportance: build.query<GetQaResponse, GetQaRequest>({
      query: requestParams =>
        buildQaToolQuery(endpoints.getQaByImportance, requestParams),
      providesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updateQa: build.mutation<any, any>({
      query: ({ body, params }) => {
        return {
          url: `${endpoints.updateQa.url}/${params?.qaId}/${params?.userId}`,
          method: endpoints.updateQa.method,
          body,
        };
      },
      invalidatesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    deleteQa: build.mutation<any, any>({
      query: params => {
        return {
          url: `${endpoints.deleteQa.url}/${params?.qaId}/${params?.userId}`,
          method: endpoints.deleteQa.method,
        };
      },
      invalidatesTags: ['Qa'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    generateAnswer: build.mutation<
      GenerateAnswerResponse,
      GenerateAnswerRequest
    >({
      query: body => {
        return {
          ...endpoints.generateAnswer,
          body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: qaActions } = slice;

export const useQaSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
