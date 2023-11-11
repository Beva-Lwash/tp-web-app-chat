export interface Message {
  id: string; 
  text: string;
  username: string;
  timestamp: number;
}

export interface NewMessageResquest{
  text: string;
  username: string;
}