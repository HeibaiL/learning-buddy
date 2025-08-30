export interface LLMProvider {
  reply(prompt: string): Promise<string>;
}
