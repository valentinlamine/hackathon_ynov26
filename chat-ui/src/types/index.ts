export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface User {
  username: string;
  token?: string;
}

export interface ApiSettings {
  url: string;
  model: string;
  type: 'ollama' | 'triton' | 'custom';
}
