import "server-only";
import { LLMProvider } from "@/domain/ports/llm";
import { FakeLLM } from "@/infrastructure/llm/fake-llm";
import { InMemoryStore as InMemoryMessageStore } from "@/infrastructure/store/memory_store";
import { InMemoryDocumentStore } from "@/infrastructure/store/memory_document_store";
import { InMemoryFileStorage } from "@/infrastructure/store/memory_file_storage";
import { InMemoryVectorStore } from "@/infrastructure/store/memory_vector_store";
import { EmbeddingsProvider } from "@/domain/ports/embeddings";
import { OpenAIEmbeddings } from "@/infrastructure/embeddings/openAi_embeddings";
import { BasicTextExtractor } from "@/infrastructure/extractor/basic_text_extractor";
import { InMemoryContextStore } from "@/infrastructure/store/memory_context_store";

function build() {
  const llm: LLMProvider = new FakeLLM(); // або OpenAI
  const messageStore = new InMemoryMessageStore();
  const documentStore = new InMemoryDocumentStore();
  const fileStorage = new InMemoryFileStorage();
  const vectors = new InMemoryVectorStore();
  const embed: EmbeddingsProvider = new OpenAIEmbeddings();
  const extractor = new BasicTextExtractor();
  const contextStore = new InMemoryContextStore();
  return {
    llm,
    messageStore,
    documentStore,
    fileStorage,
    vectors,
    embed,
    extractor,
    contextStore,
  } as const;
}
declare global {
  var __LB_CONTAINER__: ReturnType<typeof build> | undefined;
}
export function getContainer() {
  if (!globalThis.__LB_CONTAINER__) globalThis.__LB_CONTAINER__ = build();
  return globalThis.__LB_CONTAINER__;
}
