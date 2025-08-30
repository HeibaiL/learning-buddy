import { Message, MessageStore } from "@/domain/ports/message_store";

export class InMemoryStore implements MessageStore {
  private data: Message[] = [];
  async add(msg: Message) {
    this.data.push(msg);
  }
  async list() {
    return [...this.data];
  }
  async clear() {
    this.data = [];
  }
}
