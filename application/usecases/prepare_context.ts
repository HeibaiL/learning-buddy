import { DocumentStore } from "@/domain/ports/document_store";
import { ContextStore } from "@/domain/ports/context_store";
import { LLMProvider } from "@/domain/ports/llm";
import crypto from "crypto";

export async function prepareStudyContext(
  deps: { docs: DocumentStore; ctx: ContextStore; llm: LLMProvider },
  opts?: { title?: string; maxChars?: number },
) {
  const { title = "Study Pack", maxChars = 40_000 } = opts || {};
  const docs = await deps.docs.list();
  if (docs.length === 0) throw new Error("No documents to prepare");

  // Беремо текст (можна урізати, щоб влазив у prompt)
  const combined = docs.map((d) => `### ${d.name}\n${d.text}`).join("\n\n");
  const input = combined.slice(0, maxChars);

  const system = [
    "You are a study assistant. Summarize the provided materials into:",
    "- A concise overall summary (max 200 words).",
    "- 5-10 key bullet points.",
    "- A small glossary of important terms (3-10 terms).",
    "Output strictly in JSON with fields: summary, keyPoints, glossary[{term,definition}].",
  ].join("\n");

  const prompt = `Materials:\n${input}\n\nReturn JSON only.`;

  // Використай той самий LLM: або твій FakeLLM, або OpenAI
  const jsonText = await deps.llm.reply(`${system}\n\n${prompt}`);

  // Парсимо із запасом
  let parsed: any = {};
  try {
    parsed = JSON.parse(extractJson(jsonText));
  } catch {
    parsed = { summary: "", keyPoints: [], glossary: [] };
  }

  const ctx = {
    id: crypto.randomUUID(),
    title,
    summary: parsed.summary ?? "",
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    glossary: Array.isArray(parsed.glossary) ? parsed.glossary : [],
    createdAt: Date.now(),
  };

  await deps.ctx.setActive(ctx);

  // Готуємо "пресет" для майбутніх чатів
  const preset =
    `Use this study context when answering:\n` +
    `TITLE: ${ctx.title}\n` +
    `SUMMARY: ${ctx.summary}\n` +
    `KEY POINTS:\n- ${ctx.keyPoints.join("\n- ")}\n` +
    (ctx.glossary && ctx.glossary.length
      ? `GLOSSARY:\n${ctx.glossary.map((g: any) => `- ${g.term}: ${g.definition}`).join("\n")}\n`
      : "");

  return { id: ctx.id, preset, title: title };
}

function extractJson(s: string) {
  // На випадок, якщо модель додасть текст довкола JSON
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  return start >= 0 && end > start ? s.slice(start, end + 1) : s;
}
