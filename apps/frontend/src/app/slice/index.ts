import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import {
  GlobalState,
  SidebarToggled,
  SubheadToggled,
  Theme,
  User,
} from './types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  endpoints,
  formatErrors,
  baseQuery,
  baseQueryWithDelay,
} from 'utils/api/endpoints';
import { LoginFormValues, LoginResponse } from '@/types/login';

const getInitialTheme = (): Theme => {
  return (localStorage.getItem('theme') as Theme) || 'system';
};

const getInitialSidebarState = (): SidebarToggled => {
  return localStorage.getItem('sidebarToggled') as SidebarToggled;
};

const getInitialUserState = (): User | undefined => {
  try {
    const user = localStorage.getItem('tq_monorepo_user');

    return user ? (JSON.parse(user) as User) : undefined;
  } catch {
    localStorage.removeItem('tq_monorepo_expiry_time');
    localStorage.removeItem('tq_monorepo_user');
    return undefined;
  }
};

const getInitialSubheadState = (): SubheadToggled => {
  return localStorage.getItem('subheadToggled') as SubheadToggled;
};

const getInitialExpiryTime = (): string => {
  return localStorage.getItem('tq_monorepo_expiry_time') as string;
};

export const initialState: GlobalState = {
  theme: getInitialTheme(),
  user: getInitialUserState(),
  sidebarToggled: getInitialSidebarState(),
  subheadToggled: getInitialSubheadState(),
  expiryTime: getInitialExpiryTime() as any,
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
    setSubheadToggler(state, action: PayloadAction<SubheadToggled>) {
      state.subheadToggled = action.payload;
      localStorage.setItem('subheadToggled', action.payload);
    },
    logout(state) {
      state.user = undefined;
      localStorage.removeItem('tq_monorepo_user');
      localStorage.removeItem('tq_monorepo_expiry_time');
    },
    setExpiry(state, action: PayloadAction<number>) {
      state.expiryTime = action.payload;
      localStorage.setItem(
        'tq_monorepo_expiry_time',
        JSON.stringify(action.payload),
      );
    },
  },
});

export const api = createApi({
  reducerPath: 'globalApi',
  baseQuery: baseQueryWithDelay,
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginFormValues>({
      query: requestBody => {
        return {
          ...endpoints.login,
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
