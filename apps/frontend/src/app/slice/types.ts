export type Theme = 'light' | 'dark' | 'system';
export type SidebarToggled = 'opened' | 'closed';

/* --- STATE --- */
export interface GlobalState {
  token?: string;
  theme?: Theme;
  sidebarToggled?: SidebarToggled;
}
