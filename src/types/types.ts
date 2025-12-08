export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: UserRole;
  created_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  image_data: string | null;
  created_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  message_id: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface GeminiRequest {
  contents: GeminiContent[];
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      role: string;
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
}
