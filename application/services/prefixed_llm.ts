import { LLMProvider } from "@/domain/ports/llm";

export class PrefixedLLM implements LLMProvider {
  constructor(
    private inner: LLMProvider,
    private preset: string,
  ) {}
  async reply(prompt: string) {
    return this.inner.reply(`${this.preset}\n\n${prompt}`);
  }
}
