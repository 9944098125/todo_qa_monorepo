import { RootState } from '@/types';
import { initialState } from '.';
import { createSelector } from '@reduxjs/toolkit';

export const selectAdminData = (state: RootState) => state.admin?.data;
export const selectAdminIsLoading = (state: RootState) =>
  state.admin?.isLoading;
export const selectAdminError = (state: RootState) => state.admin?.error;

const selectSlice = (state: RootState) => state.admin || initialState;

export const selectEditableUser = createSelector(
  [selectSlice],
  state => state?.editableUser,
);
