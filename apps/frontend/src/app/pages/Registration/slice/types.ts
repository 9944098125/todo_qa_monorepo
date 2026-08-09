export interface RegistrationState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePicture: string;
  bio: string;
}

export interface RegistrationResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: unknown;
  };
  meta: {
    url: string;
  };
}
