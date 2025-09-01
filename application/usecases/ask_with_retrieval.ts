import { LLMProvider } from "@/domain/ports/llm";
import { MessageStore } from "@/domain/ports/message_store";
import { EmbeddingsProvider } from "@/domain/ports/embeddings";
import { VectorStore } from "@/domain/ports/vector_store";
import { Message } from "@/domain/ports/message_store";
import { buildPrompt } from "@/application/services/prompt_builder";
import crypto from "crypto";

export async function askWithRetrieval(
  deps: {
    llm: LLMProvider;
    messageStore: MessageStore;
    embed: EmbeddingsProvider;
    vectors: VectorStore;
  },
  question: string,
  topK = 5,
  opts?: { systemStyle?: string },
) {
  await deps.messageStore.add({
    id: crypto.randomUUID(),
    role: "user",
    content: question,
    createdAt: Date.now(),
  });

  const qv = await deps.embed.embedOne(question);
  const hits = await deps.vectors.search(qv, topK);
  const context = hits
    .sort((a, b) => a.metadata - b.metadata)
    .map((h) => `- [${h.metadata?.name} #${h.metadata?.idx}] ${h.metadata?.text}`)
    .join("\n");

  const history = await deps.messageStore.list();
  const prompt = buildPrompt({
    history,
    question,
    systemStyle: opts?.systemStyle,
    systemContext: context || "(no relevant context)",
  });

  const answer = await deps.llm.reply(prompt);

  const withSources =
    answer +
    (hits.length
      ? `\n\nSources:\n` +
        hits
          .map((h) => `• ${h.metadata?.name} #${h.metadata?.idx} (score ${h.score.toFixed(3)})`)
          .join("\n")
      : "");
  const assistant: Message = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: withSources,
    createdAt: Date.now(),
  };
  await deps.messageStore.add(assistant);

  return assistant;
}
