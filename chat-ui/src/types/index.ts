export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ApiSettings {
  url: string;
  model: string;
  type: 'ollama' | 'triton' | 'custom';
}
