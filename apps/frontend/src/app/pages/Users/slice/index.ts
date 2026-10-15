import { createSlice } from '../../../../utils/@reduxjs/toolkit';
import { useInjectReducer } from '../../../../utils/redux-injectors';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  GetUserResponse,
  AdminState,
  UpdateUserResponse,
  UpdateUserRequest,
} from './types';
import { createApi } from '@reduxjs/toolkit/query/react';

import {
  endpoints,
  formatErrors,
  baseQueryWithDelay,
} from '../../../../utils/api/endpoints';

export const initialState: AdminState = {
  data: null,
  error: null,
  isLoading: false,
  editableUser: {
    _id: '',
    userId: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    profilePicture: '',
    bio: '',
    isAdmin: '',
  },
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // required functions
    editUser(state, action: PayloadAction<any>) {
      state.editableUser = {
        ...action.payload,
      };
    },
    resetEditableUser(state) {
      state.editableUser = null;
    },
  },
});

export const api = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithDelay,
  tagTypes: ['Users'],
  endpoints: build => ({
    // api integration functions
    createUser: build.mutation<any, any>({
      query: ({ body, adminId }) => {
        return {
          url: `${endpoints.createUser.url}/${adminId}`,
          method: endpoints.createUser.method,
          body: body,
        };
      },
      invalidatesTags: ['Users'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),

    getUsers: build.query<GetUserResponse, any>({
      query: () => {
        return {
          ...endpoints.getUsers,
          params: {
            page: 1,
            pageSize: 10,
          },
        };
      },
      providesTags: ['Users'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    getUserById: build.query<GetUserByIdResponse, GetUserByIdRequest>({
      query: query => {
        return {
          ...endpoints.getUserById,
          params: {
            ...query,
          },
        };
      },
      providesTags: ['Users'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),

    updateUser: build.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ userId, body }) => {
        return {
          url: `${endpoints.updateUser.url}/${userId}`,
          method: endpoints.updateUser.method,
          body: body,
        };
      },
      invalidatesTags: ['Users'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
    deleteUser: build.mutation<DeleteUserResponse, DeleteUserRequest>({
      query: params => {
        return {
          url: `${endpoints.deleteUser.url}/${params.userId}/${params.adminId}`,
          method: endpoints.deleteUser.method,
        };
      },
      invalidatesTags: ['Users'],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: usersActions } = slice;

export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
