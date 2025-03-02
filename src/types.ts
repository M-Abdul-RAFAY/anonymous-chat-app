export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  encrypted: boolean;
}

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Room {
  id: string;
  encryptionKey?: string;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}