import { RootState } from '@/types';
import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.registration || initialState;
export const selectRegistrationData = createSelector(
  [selectSlice],
  state => state?.data,
);
export const selectRegistrationIsLoading = createSelector(
  [selectSlice],
  state => state?.isLoading,
);
export const selectRegistrationError = createSelector(
  [selectSlice],
  state => state?.error,
);
