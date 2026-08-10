export interface TodoFormValues {
  Id: string;
  Name: string;
  Time: string;
}

export interface TodoResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      token: string;
      user: {
        _id: string;
        name: string;
        Time: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
  meta: {
    url: string;
  };
}
