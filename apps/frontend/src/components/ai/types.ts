import type { UIMessage } from "ai";

export interface AiChatListItem {
  id: string;
  title: string;
  createdAt: string;
}

export interface AiChatHistory {
  chats: AiChatListItem[];
  hasMore: boolean;
}

export interface AiChatDetail {
  id: string;
  title: string;
  provider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: UIMessage[];
}
