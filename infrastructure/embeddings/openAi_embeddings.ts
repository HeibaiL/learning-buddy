import { EmbeddingsProvider } from "@/domain/ports/embeddings";
import OpenAI from "openai";

export class OpenAIEmbeddings implements EmbeddingsProvider {
  readonly dim = 1536;
  private client: OpenAI;
  private model = "text-embedding-3-small"; // дешевший і швидкий варіант

  constructor(apiKey: string = process.env.OPENAI_API_KEY!) {
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
    this.client = new OpenAI({ apiKey });
  }

  async embedOne(t: string) {
    return (await this.embed([t]))[0];
  }

  async embed(texts: string[]) {
    const res = await this.client.embeddings.create({
      model: this.model,
      input: texts,
    });
    return res.data.map((d) => d.embedding);
  }
}
