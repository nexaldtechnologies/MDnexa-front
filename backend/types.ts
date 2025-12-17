
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  region: string;
  country: string;
  updatedAt: Date;
  isFavorite?: boolean;
}

export interface GenerateStreamParams {
  history: Message[];
  newMessage: string;
  region: string;
  country: string;
  userRole: string;
  isShortAnswer: boolean;
  language?: string;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}
