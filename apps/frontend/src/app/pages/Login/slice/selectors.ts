import { RootState } from '@/store';

export const selectLoginData = (state: RootState) => state.login.data;
export const selectLoginIsLoading = (state: RootState) => state.login.isLoading;
export const selectLoginError = (state: RootState) => state.login.error;
