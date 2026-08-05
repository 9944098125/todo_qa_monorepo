export type Theme = 'light' | 'dark';
export type SidebarToggled = 'opened' | 'closed';
export type User = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  phone: string;
  bio: string;
  isAdmin: boolean;
};

/* --- STATE --- */
export interface GlobalState {
  token?: string;
  user?: User;
  theme?: Theme;
  sidebarToggled?: SidebarToggled;
}
