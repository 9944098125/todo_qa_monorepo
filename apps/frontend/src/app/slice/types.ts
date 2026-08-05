export type Theme = 'light' | 'dark';
export type SidebarToggled = 'opened' | 'closed';

/* --- STATE --- */
export interface GlobalState {
  token?: string;
  theme?: Theme;
  sidebarToggled?: SidebarToggled;
}
