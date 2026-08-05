import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { GlobalState, SidebarToggled, Theme } from './types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints, formatErrors, baseQuery } from 'utils/api/endpoints';

const getInitialTheme = (): Theme => {
  return (localStorage.getItem('theme') as Theme) || 'system';
};

const getInitialSidebarState = (): SidebarToggled => {
  return localStorage.getItem('sidebarToggled') as SidebarToggled;
};

export const initialState: GlobalState = {
  theme: getInitialTheme(),
  token: '',
  sidebarToggled: getInitialSidebarState(),
};

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    sidebarToggler(state, action: PayloadAction<SidebarToggled>) {
      state.sidebarToggled = action.payload;
      localStorage.setItem('sidebarToggled', action.payload);
    },
  },
});

export const api = createApi({
  reducerPath: 'globalApi',
  baseQuery,
  endpoints: build => ({
    login: build.mutation<any, any>({
      query: body => {
        return {
          ...endpoints.login,
          body: body,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue.data);
      },
    }),
  }),
});

export const { actions: globalActions } = slice;

export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectReducer({ key: api.reducerPath, reducer: api.reducer });
  return {
    actions: slice.actions,
    ...api,
  };
};
