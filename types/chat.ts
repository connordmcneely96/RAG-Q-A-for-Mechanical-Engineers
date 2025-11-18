export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  createdAt: Date;
}

export interface Source {
  content: string;
  metadata: {
    source?: string;
    page?: number;
    category?: string;
    [key: string]: any;
  };
  score?: number;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
