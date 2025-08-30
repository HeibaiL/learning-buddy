import { MessageStore } from "@/domain/ports/message_store";

export async function getHistory(deps: { store: MessageStore }) {
  const list = await deps.store.list();
  return list.sort((a, b) => a.createdAt - b.createdAt);
}
