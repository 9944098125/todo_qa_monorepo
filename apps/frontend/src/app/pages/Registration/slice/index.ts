import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import {
  RegistrationRequest,
  RegistrationResponse,
  RegistrationState,
} from './types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { endpoints, formatErrors, baseQuery } from 'utils/api/endpoints';

export const initialState: RegistrationState = {
  data: null,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // required functions
  },
});

export const api = createApi({
  reducerPath: 'registrationApi',
  baseQuery,
  endpoints: build => ({
    register: build.mutation<RegistrationResponse, RegistrationRequest>({
      query: body => {
        return {
          ...endpoints.register,
          body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
      },
    }),
  }),
});

export const { actions: registrationActions } = slice;

export const useRegistrationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
