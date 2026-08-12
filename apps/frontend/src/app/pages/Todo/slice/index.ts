import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import {
  GetTodoRequest,
  GetTodoResponse,
  TodoRequest,
  TodoResponse,
  TodoState,
} from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints, formatErrors, baseQuery } from 'utils/api/endpoints';

export const initialState: TodoState = {
  data: null,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // required functions
  },
});

export const api = createApi({
  reducerPath: 'todoApi',
  baseQuery,
  endpoints: build => ({
    createTodo: build.mutation<TodoResponse, TodoRequest>({
      query: body => {
        return {
          ...endpoints.createTodo,
          body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getTodoItems: build.query<GetTodoResponse, GetTodoRequest>({
      query: ({ requestParams, query }) => {
        return {
          url: `${endpoints.getTodoItems.url}/${requestParams?.userId}`,
          method: endpoints.getTodoItems.method,
          params: query,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updateTodo: build.mutation<any, any>({
      query: ({ body, requestParams }) => {
        return {
          url: `${endpoints.updateTodo.url}/${requestParams.todoId}`,
          method: endpoints.updateTodo.method,
          body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        formatErrors(baseQueryReturnValue);
      },
    }),
    deleteTodo: build.mutation<any, any>({
      query: params => {
        return {
          url: `${endpoints.deleteTodo.url}/${params.todoId}/${params.userId}`,
          method: endpoints.deleteTodo.method,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: todoActions } = slice;

export const useTodoSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
