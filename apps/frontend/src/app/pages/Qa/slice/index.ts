import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { GetToolsResponse, QaState, ToolRequest, ToolResponse } from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints, formatErrors, baseQuery } from 'utils/api/endpoints';

export const initialState: QaState = {
  data: null,
  error: null,
  isLoading: false,
};

const slice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    // required functions
  },
});

export const api = createApi({
  reducerPath: 'qaApi',
  baseQuery,
  endpoints: build => ({
    createTool: build.mutation<ToolResponse, ToolRequest>({
      query: body => {
        return {
          ...endpoints.createTool,
          body,
        };
      },
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
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getToolById: build.query<any, any>({
      query: query => {
        return {
          ...endpoints.getToolById,
          params: {
            ...query,
          },
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updateTool: build.mutation<any, any>({
      query: query => {
        return {
          ...endpoints.updateTool,
          params: {
            ...query,
          },
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    deleteTool: build.mutation<any, any>({
      query: query => {
        return {
          ...endpoints.deleteTool,
          params: {
            ...query,
          },
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
