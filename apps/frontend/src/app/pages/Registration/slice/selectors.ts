import { RootState } from '@/types';

export const selectRegistrationData = (state: RootState) =>
  state.registration.data;
export const selectRegistrationIsLoading = (state: RootState) =>
  state.registration.isLoading;
export const selectRegistrationError = (state: RootState) =>
  state.registration.error;
