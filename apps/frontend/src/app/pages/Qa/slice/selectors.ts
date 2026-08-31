import { RootState } from '@/types';
import { initialState } from '.';
import { createSelector } from '@reduxjs/toolkit';

const selectSlice = (state: RootState) => state.qa || initialState;

export const selectEditableTool = createSelector(
  [selectSlice],
  state => state.editableTool,
);

export const selectEditableQa = createSelector(
  [selectSlice],
  state => state.editableQa,
);
