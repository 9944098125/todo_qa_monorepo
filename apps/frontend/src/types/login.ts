export interface LoginFormValues {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      user: {
        _id: string;
        name: string;
        email: string;
        profilePicture: string;
        phone: string;
        bio: string;
        isAdmin: boolean;
        createdAt: string;
        updatedAt: string;
      };
      expiryTime: number;
    };
  };
  meta: {
    url: string;
  };
}
