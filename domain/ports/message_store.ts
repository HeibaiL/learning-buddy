export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface MessageStore {
  add(msg: Message): Promise<void>;
  list(): Promise<Message[]>;
  clear(): Promise<void>;
}
