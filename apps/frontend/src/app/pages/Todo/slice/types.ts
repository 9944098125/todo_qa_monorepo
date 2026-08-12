export interface TodoState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface TodoRequest {
  title: string;
  description: string;
  urgency: boolean;
  deadline: Date;
  userId: string;
}

export interface TodoResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      todo: {
        title: string;
        description: string;
        urgency: boolean;
        deadline: Date;
        userId: string;
        _id: string;
        createdAt: Date;
      };
    };
  };
  meta: {
    url: 'http://localhost:5001/api/todo/create';
  };
}
