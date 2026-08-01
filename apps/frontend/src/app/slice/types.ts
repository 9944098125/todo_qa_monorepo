export type Theme = 'light' | 'dark' | 'system';

/* --- STATE --- */
export interface GlobalState {
  token?: string;
  theme?: Theme;
}
