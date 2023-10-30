export interface Message {
  id: number; 
  text: string;
  username: string;
  timestamp: number;
}

export interface NewMessageResquest{
  text: string;
  username: string;
}