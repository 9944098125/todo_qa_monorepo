export interface RegistrationFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
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
    };
  };
  //    meta: {
  //     url: string;
  //   };
}
