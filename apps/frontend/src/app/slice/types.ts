export type Theme = 'light' | 'dark';
export type SidebarToggled = 'opened' | 'closed';
export type SubheadToggled = 'view' | 'hide';
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
  user?: User;
  theme?: Theme;
  sidebarToggled?: SidebarToggled;
  subheadToggled?: SubheadToggled;
}
