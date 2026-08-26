import { RootState } from '@/types';
import { createSelector } from '@reduxjs/toolkit';

const selectSlice = (state: RootState) => state?.todo;

export const selectEditableTodo = createSelector(
  [selectSlice],
  state => state?.editableTodo,
);
