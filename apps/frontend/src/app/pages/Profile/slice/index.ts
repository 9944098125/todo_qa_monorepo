import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQueryWithDelay,
} from 'utils/api/endpoints';
import {
  GetUserWithIdResponse,
  ProfileState,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from './types';

export const initialState: ProfileState = {
  data: null,
  error: null,
  isLoading: false,
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
});

export const api = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithDelay,
  tagTypes: ['Profile'],
  endpoints: build => ({
    getUserWithId: build.query<GetUserWithIdResponse, string>({
      query: userId => {
        return {
          url: `${endpoints.getUserWithId.url}/${userId}`,
          method: endpoints.getUserWithId.method,
        };
      },
      providesTags: ['Profile'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updateUser: build.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ userId, body }) => {
        return {
          url: `${endpoints.updateAuthUser.url}/${userId}`,
          method: endpoints.updateAuthUser.method,
          body,
        };
      },
      invalidatesTags: ['Profile'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    updatePassword: build.mutation<
      UpdatePasswordResponse,
      UpdatePasswordRequest
    >({
      query: ({ userId, body }) => {
        return {
          url: `${endpoints.updatePassword.url}/${userId}/updatePassword`,
          method: endpoints.updatePassword.method,
          body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: profileActions } = slice;

export const useProfileSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
