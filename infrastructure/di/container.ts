import { BasicTextExtractor } from "@/infrastructure/extractor/basic_text_extractor";
import { InMemoryContextStore } from "@/infrastructure/store/memory_context_store";
import { InMemoryFileStorage } from "@/infrastructure/store/memory_file_storage";
import { InMemoryDocumentStore } from "@/infrastructure/store/memory_document_store";
import { FakeLLM } from "@/infrastructure/llm/fake-llm";
import { LLMProvider } from "@/domain/ports/llm";
import { InMemoryStore } from "@/infrastructure/store/memory_store";

function build() {
  const llm: LLMProvider = new FakeLLM();
  const messageStore = new InMemoryStore();
  const documentStore = new InMemoryDocumentStore();
  const fileStorage = new InMemoryFileStorage();
  const contextStore = new InMemoryContextStore();
  const extractor = new BasicTextExtractor();
  return { llm, messageStore, documentStore, fileStorage, contextStore, extractor } as const;
}

// HMR-/serverless-friendly singleton
declare global {
  // eslint-disable-next-line no-var
  var __LB_CONTAINER__: ReturnType<typeof build> | undefined;
}

export function getContainer() {
  if (!globalThis.__LB_CONTAINER__) {
    globalThis.__LB_CONTAINER__ = build();
  }
  return globalThis.__LB_CONTAINER__;
}
