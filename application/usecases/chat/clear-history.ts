import { MessageStore } from "@/domain/ports/message_store";

export async function clearHistory(deps: { store: MessageStore }) {
  const s: any = deps.store;

  if (typeof s.clear === "function") {
    await s.clear();
    return;
  }

  const all = await deps.store.list();
  if (typeof s.remove === "function") {
    for (const m of all) await s.remove(m.id);
    return;
  }

  if (typeof s.setAll === "function") {
    await s.setAll([]);
  } else {
    console.warn("[clearHistory] store has no clear/remove/setAll");
  }
}
