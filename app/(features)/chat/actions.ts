"use server";
import "server-only";

import { getContainer } from "@/infrastructure/di/container";
import { askWithRetrieval } from "@/application/usecases/ask_with_retrieval";
import { ask } from "@/application/usecases/chat/ask";
import { getHistory } from "@/application/usecases/chat/history";
import { clearHistory } from "@/application/usecases/chat/clear-history";

export async function askAction(text: string) {
  const c = getContainer();
  const hasIndex = (await c.vectors.size()) > 0;
  return hasIndex
    ? askWithRetrieval(
        { llm: c.llm, messageStore: c.messageStore, embed: c.embed, vectors: c.vectors },
        text,
      )
    : ask({ llm: c.llm, messageStore: c.messageStore }, text);
}
export async function historyAction() {
  const c = getContainer();
  return getHistory({ store: c.messageStore });
}
export async function clearAction() {
  const c = getContainer();
  await clearHistory({ store: c.messageStore });
}
