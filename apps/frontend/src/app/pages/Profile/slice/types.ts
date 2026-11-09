import { User } from '@/app/slice/types';

export interface ProfileState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface GetUserWithIdResponse {
  status: number;
  message?: string;
  data: {
    message?: string;
    data?: {
      user: User;
    };
    user?: User;
  };
}

export interface UpdateUserRequest {
  userId: string;
  body: {
    name?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    bio?: string;
  };
}

export interface UpdateUserResponse {
  status: number;
  message?: string;
  data: {
    message?: string;
    data?: {
      user: User;
    };
    user?: User;
  };
}

export interface UpdatePasswordRequest {
  userId: string;
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

export interface UpdatePasswordResponse {
  status: number;
  message: string;
  data?: any;
}
