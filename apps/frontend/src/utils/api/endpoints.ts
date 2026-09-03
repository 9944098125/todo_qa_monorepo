import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const baseUrl =
  process.env.REACT_APP_API_URL ||
  'https://todo-qa-monorepo-backend.vercel.app/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const baseQuery = fetchBaseQuery({
  baseUrl,
  headers: defaultHeaders,
  credentials: 'include',
});

export const baseQueryWithDelay: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

export const formatErrors = (errors: any) => {
  return (
    errors?.data?.data?.message ||
    errors?.data?.message ||
    'Something went wrong'
  );
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const endpoints = {
  baseUrl,
  login: {
    url: '/auth/login',
    method: HTTP_METHODS.POST,
  },
  register: {
    url: '/auth/register',
    method: HTTP_METHODS.POST,
  },
  createTodo: {
    url: '/todo/create',
    method: HTTP_METHODS.POST,
  },
  getTodoItems: {
    url: '/todo',
    method: HTTP_METHODS.GET,
  },
  updateTodo: {
    url: '/todo',
    method: HTTP_METHODS.PATCH,
  },
  deleteTodo: {
    url: '/todo',
    method: HTTP_METHODS.DELETE,
  },
  createTool: {
    url: '/tools',
    method: HTTP_METHODS.POST,
  },
  getTools: {
    url: '/tools',
    method: HTTP_METHODS.GET,
  },
  getToolById: {
    url: '/tools/tool',
    method: HTTP_METHODS.GET,
  },
  updateTool: {
    url: '/tools/update-tool',
    method: HTTP_METHODS.PATCH,
  },
  deleteTool: {
    url: '/tools/delete-tool',
    method: HTTP_METHODS.DELETE,
  },
  createQa: {
    url: '/qa/create',
    method: HTTP_METHODS.POST,
  },
  getQaByToolId: {
    // userId & toolId in req params
    url: '/qa',
    method: HTTP_METHODS.GET,
  },
  updateQa: {
    // qaId & userId in req params
    url: '/qa',
    method: HTTP_METHODS.PATCH,
  },
  deleteQa: {
    // qaId & userId in req params
    url: '/qa',
    method: HTTP_METHODS.DELETE,
  },
};
