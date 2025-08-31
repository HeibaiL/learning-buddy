import { Message } from "@/domain/ports/message_store";

export function buildPrompt(params: {
  history: Message[];
  question: string;
  systemStyle?: string;
  systemContext?: string;
}) {
  const { history, question, systemStyle, systemContext } = params;

  const header: string[] = [];
  if (systemStyle) header.push(`SYSTEM RULES:\n${systemStyle}`);
  if (systemContext) header.push(`CONTEXT:\n${systemContext}`);

  const hist = history
    .filter((m) => m.role === "user" || m.role === "assistant") // system можна не дублювати
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  return [header.join("\n\n"), hist ? `HISTORY:\n${hist}` : "", `USER:\n${question}`, `ASSISTANT:`]
    .filter(Boolean)
    .join("\n\n");
}
