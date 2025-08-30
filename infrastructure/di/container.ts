import "server-only";
import { FakeLLM } from "@/infrastructure/llm/fake-llm";
import { InMemoryStore } from "@/infrastructure/store/memory_store";

export function makeContainer() {
  const llm = new FakeLLM();
  const store = new InMemoryStore();
  return { llm, store } as const;
}
