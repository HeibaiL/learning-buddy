"use server";
import { getContainer } from "@/infrastructure/di/container";
import { ask } from "@/application/usecases/chat/ask";
import { getHistory } from "@/application/usecases/chat/history";
import { PrefixedLLM } from "@/application/services/prefixed_llm";

const c = getContainer();

export async function askAction(text: string) {
  let llm = c.llm;
  const active = await c.contextStore.getActive();
  if (active) {
    const preset =
      `You are answering with the following study context.\n` +
      `TITLE: ${active.title}\n` +
      `SUMMARY: ${active.summary}\n` +
      `KEY POINTS:\n- ${active.keyPoints.join("\n- ")}`;
    llm = new PrefixedLLM(llm, preset);
  }

  return ask({ llm, messageStore: c.messageStore }, text);
}

export async function historyAction() {
  return getHistory({ store: c.messageStore });
}

export async function clearAction() {
  await c.messageStore.clear();
  return { ok: true };
}
