import pLimit from "p-limit"; // npm i p-limit
import { DocumentStore } from "@/domain/ports/document_store";
import { EmbeddingsProvider } from "@/domain/ports/embeddings";
import { VectorStore } from "@/domain/ports/vector_store";
import { chunkText } from "@/application/services/chunker";

const MAX_TOKENS_PER_REQUEST = 280_000;
const MAX_ITEMS_PER_REQUEST = 128;
const CONCURRENCY = 3;
const approxTokens = (s: string) => Math.ceil(s.length / 4); // груба оцінка

async function embedBatch(embed: EmbeddingsProvider, texts: string[], retry = 2) {
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      return await embed.embed(texts);
    } catch (e: any) {
      const is429 = e?.status === 429 || e?.code === "rate_limit_exceeded";
      const is5xx = e?.status >= 500;
      if (!(is429 || is5xx) || attempt === retry) throw e;
      const backoff = 500 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  return [];
}

export async function prepareStudyContext(
  deps: { docs: DocumentStore; embed: EmbeddingsProvider; vectors: VectorStore },
  opts?: { chunkSize?: number; overlap?: number; clearFirst?: boolean; docIds?: string[] },
) {
  const chunkSize = opts?.chunkSize ?? 1200;
  const overlap = opts?.overlap ?? 120;

  if (opts?.clearFirst && deps.vectors.clear) await deps.vectors.clear();

  let docs = await deps.docs.list();
  if (opts?.docIds?.length) {
    const set = new Set(opts.docIds);
    docs = docs.filter((d) => set.has(d.id));
  }
  if (!docs.length) throw new Error("No documents to index");

  let totalChunks = 0;

  for (const d of docs) {
    const raw = chunkText(d.text, { size: chunkSize, overlap });

    const chunks = raw.filter((t) => t && t.trim().length > 40);
    if (!chunks.length) continue;

    const batches: { idxs: number[]; texts: string[] }[] = [];
    let i = 0;
    while (i < chunks.length) {
      let count = 0,
        tokens = 0;
      const idxs: number[] = [];
      const texts: string[] = [];
      while (i < chunks.length && count < MAX_ITEMS_PER_REQUEST) {
        const t = chunks[i];
        const est = approxTokens(t);
        if (count > 0 && tokens + est > MAX_TOKENS_PER_REQUEST) break;
        idxs.push(i);
        texts.push(t);
        tokens += est;
        count++;
        i++;
      }
      batches.push({ idxs, texts });
    }

    const limit = pLimit(CONCURRENCY);
    await Promise.all(
      batches.map((b, bi) =>
        limit(async () => {
          const vecs = await embedBatch(deps.embed, b.texts);
          for (let k = 0; k < vecs.length; k++) {
            const idx = b.idxs[k];
            await deps.vectors.add(`${d.id}::${idx}`, vecs[k], {
              docId: d.id,
              name: d.name,
              idx,
              text: chunks[idx],
            });
          }
        }),
      ),
    );
    totalChunks += chunks.length;
  }

  return {
    docsIndexed: docs.length,
    chunksIndexed: totalChunks,
    dim: deps.embed.dim,
    chunkSize,
    overlap,
  };
}
