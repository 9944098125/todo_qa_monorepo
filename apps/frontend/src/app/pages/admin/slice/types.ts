import { User } from '@/app/slice/types';

export interface AdminState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  editableUser: {
    _id: string;
    userId: string | undefined;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    phone: string | undefined;
    profilePicture: string | undefined;
    bio: string | undefined;
    isAdmin: string | undefined;
  } | null;
}

//extra code
export interface ToolItem {
  userId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  description: string;
  _id: string;
}

export interface UserItem {
  userId: string | undefined;
  name: string | undefined;
  slug: string | undefined;
  image: string | undefined;
  color: string | undefined;
  description: string | undefined;
  _id: string;
}

//User related types

export interface GetUserRequest {
  userId: string | undefined;
  toolId: string | undefined;
}

export interface GetUserResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalDocuments: number;
    documents: {
      _id: string;
      name: string;
      email: string;
      password: string;
      profilePicture: string;
      phone: string;
      bio: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
  };
  meta: {
    url: string;
  };
}

export interface UpdateUserRequest {
  query: {
    userId: string | undefined;
  };
  body: {
    userId: string | undefined;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    phone: string | undefined;
    profilePicture: string | undefined;
    bio: string | undefined;
    isAdmin: boolean | undefined;
  };
}

export interface UpdateUserResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      User: {
        userId: string | undefined;
        name: string | undefined;
        email: string | undefined;
        password: string | undefined;
        phone: string | undefined;
        profilePicture: string | undefined;
        bio: string | undefined;
        isAdmin: boolean | undefined;
      };
    };
  };
  meta: {
    url: string;
  };
}

export interface GetUserByIdRequest {
  userId: string | undefined;
}

export interface GetUserByIdResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      User: {
        _id: string;
        userId: string;
        name: string;
        email: string;
        password: string;
        phone: string;
        profilePicture: string;
        bio: string;
        isAdmin: string;
        createdAt: string;
      };
    };
  };
  meta: {
    url: string;
  };
}
export interface Admin {
  _id: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture: string;
  bio: string;
  isAdmin: string;
}

export interface DeleteUserRequest {
  userId: string | undefined;
  adminId: string | undefined;
}

export interface DeleteUserResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: null;
  };
  meta: {
    url: string;
  };
}
