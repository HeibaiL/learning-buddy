import { LLMProvider } from "@/domain/ports/llm";
import { MessageStore } from "@/domain/ports/message_store";
import crypto from "crypto";

enum RolesType {
  USER = "user",
  ASSISTANT = "assistant",
}
export async function ask(deps: { llm: LLMProvider; store: MessageStore }, userText: string) {
  const now = Date.now();
  await deps.store.add({
    id: crypto.randomUUID(),
    role: RolesType.USER,
    content: userText,
    createdAt: now,
  });

  const answer = await deps.llm.reply(userText);

  await deps.store.add({
    id: crypto.randomUUID(),
    role: RolesType.ASSISTANT,
    content: answer,
    createdAt: Date.now(),
  });
  return { answer };
}
