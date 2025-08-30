"use server";
import { makeContainer } from "@/infrastructure/di/container";
import { ask } from "@/application/usecases/chat/ask";
import { getHistory } from "@/application/usecases/chat/history";

const c = makeContainer();

export async function askAction(text: string) {
  return ask({ llm: c.llm, store: c.store }, text);
}

export async function historyAction() {
  return getHistory({ store: c.store });
}

export async function clearAction() {
  await c.store.clear();
  return { ok: true };
}
