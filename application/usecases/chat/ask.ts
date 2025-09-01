import { LLMProvider } from "@/domain/ports/llm";
import { MessageStore, Message } from "@/domain/ports/message_store";
import crypto from "crypto";

export async function ask(deps: { llm: LLMProvider; messageStore: MessageStore }, text: string) {
  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content: text,
    createdAt: Date.now(),
  };
  await deps.messageStore.add(userMsg);

  const history = await deps.messageStore.list();

  const prompt = history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");

  const answer = await deps.llm.reply(prompt);

  const assistantMsg: Message = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: answer,
    createdAt: Date.now(),
  };

  await deps.messageStore.add(assistantMsg);

  return assistantMsg;
}
