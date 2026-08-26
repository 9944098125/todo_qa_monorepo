import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'types';

const baseUrl = 'http://localhost:5001/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const baseQuery = fetchBaseQuery({
  baseUrl,
  headers: defaultHeaders,
  credentials: 'include',
});

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
};
