import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state?.aiSlice || initialState;

export const selectIsAiDrawerOpen = createSelector(
  [selectSlice],
  state => state.isDrawerOpen,
);

export const selectAiMessages = createSelector(
  [selectSlice],
  state => state.messages,
);

export const selectAiLoading = createSelector(
  [selectSlice],
  state => state.isLoading,
);

export const selectAiError = createSelector(
  [selectSlice],
  state => state.error,
);
