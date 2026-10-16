import { RootState } from '@/types';
import { initialState } from '.';
import { createSelector } from '@reduxjs/toolkit';

export const selectAdminData = (state: RootState) => state.users?.data;
export const selectAdminIsLoading = (state: RootState) =>
  state.users?.isLoading;
export const selectAdminError = (state: RootState) => state.users?.error;

const selectSlice = (state: RootState) => state.users || initialState;

export const selectEditableUser = createSelector(
  [selectSlice],
  state => state?.editableUser,
);
