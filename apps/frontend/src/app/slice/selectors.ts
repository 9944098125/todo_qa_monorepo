import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state?.global || initialState;

export const selectGlobal = createSelector([selectSlice], state => state);

export const selectTheme = createSelector(
  [selectSlice],
  state => state.theme || 'system',
);

export const selectSidebarToggler = createSelector(
  [selectSlice],
  state => state.sidebarToggled,
);
