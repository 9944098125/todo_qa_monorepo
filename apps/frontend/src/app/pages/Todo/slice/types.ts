export interface TodoState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  editableTodo: {
    _id: string;
    title: string;
    description: string;
    urgency: boolean;
    deadline: string;
    userId: string;
  } | null;
}

export interface TodoRequest {
  title: string | undefined;
  description: string | undefined;
  urgency: boolean;
  deadline: string | undefined;
  userId: string | undefined;
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

export interface GetTodoResponse {
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
      title: string;
      description: string;
      urgency: boolean;
      deadline: string;
      userId: string;
      createdAt: string;
    }[];
  };
  meta: {
    url: 'http://localhost:5001/api/todo/6a7c479061f3d3519c5f4984?page=1&pageSize=20';
  };
}

export interface GetTodoRequest {
  requestParams: {
    userId: string;
  };
  query: {
    page: number;
    pageSize: number;
  };
}

export interface TodoItem {
  _id: string;
  title: string;
  description: string;
  urgency: boolean;
  deadline: string;
  userId: string;
  createdAt: string;
}

export interface DeleteTodoRequest {
  userId: string;
  todoId: string;
}

export interface DeleteTodoResponse {
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
