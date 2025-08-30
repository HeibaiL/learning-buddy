import { LLMProvider } from "@/domain/ports/llm";
import { OpenAI } from "openai";

type OpenAiLLMOptions = {
  model?: string;
  system?: string;
  timeoutMs?: number;
};

export class FakeLLM implements LLMProvider {
  private client: OpenAI;
  private model: string;
  private system?: string;

  constructor(opts: OpenAiLLMOptions = {}) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: opts.timeoutMs ?? 30_000,
    });
    this.model = opts.model ?? "gpt-4o-mini";
    this.system = opts.system;
  }

  async reply(prompt: string): Promise<string> {
    const resp = await this.client.responses.create({
      model: this.model,
      ...(this.system ? { instructions: this.system } : {}),
      input: prompt,
    });

    const text = (resp as any).output_text as string | undefined;
    if (text && text.trim().length > 0) return text.trim();

    const fallback =
      resp.output
        ?.map((item: any) =>
          "content" in item ? item.content?.map((c: any) => c?.text?.content ?? "").join("") : "",
        )
        .join("") ?? "";
    return fallback.trim() || "Couldn't find any results.";
  }
}
