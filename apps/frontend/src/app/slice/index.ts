import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { GlobalState, SidebarToggled, Theme, User } from './types';
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
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('tq_monorepo_user', JSON.stringify(action.payload));
    },
  },
});

export const api = createApi({
  reducerPath: 'globalApi',
  baseQuery,
  endpoints: build => ({
    login: build.mutation<any, any>({
      query: requestBody => {
        return {
          url: endpoints.login.url,
          method: endpoints.login.method,
          body: requestBody,
        };
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return formatErrors(baseQueryReturnValue);
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
