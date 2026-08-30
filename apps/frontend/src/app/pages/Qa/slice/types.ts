export interface QaState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  editableTool: {
    _id: string;
    userId: string;
    name: string;
    slug: string;
    image: string;
    color: string;
    description: string;
  } | null;
}

export interface ToolItem {
  userId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  description: string;
  _id: string;
}

export interface ToolResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      tool: ToolItem;
    };
  };
  meta: {
    url: string;
  };
}

export interface ToolRequest {
  name: string;
  slug: string;
  image: string;
  color: string;
  description: string;
  userId: string;
}

export interface GetToolsResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      tools: ToolItem[];
    };
  };
  meta: {
    url: string;
  };
}

export interface UpdateToolRequest {
  query: {
    toolId: string;
    userId: string;
  };
  body: {
    name: string;
    slug: string;
    image: string;
    color: string;
    description: string;
    userId: string;
  };
}

export interface UpdateToolResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      tool: ToolItem;
    };
  };
  meta: {
    url: string;
  };
}

export interface DeleteToolRequest {
  userId: string;
  toolId: string;
}

export interface DeleteToolResponse {
  status: number;
  statusText: string;
  data: {
    message: string | null;
    data: null;
  };
  meta: {
    url: string;
  };
}

export interface GetToolByIdRequest {
  userId: string;
  toolId: string;
}
export interface GetToolByIdResponse {
  status: number;
  statusText: string;
  data: {
    message: string;
    data: {
      tool: {
        _id: string;
        userId: string;
        name: string;
        slug: string;
        image: string;
        color: string;
        description: string;
        createdAt: string;
      };
    };
  };
  meta: {
    url: string;
  };
}
