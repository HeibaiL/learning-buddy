export interface EmbeddingsProvider {
  readonly dim: number;
  embedOne(text: string): Promise<number[]>;
  embed(texts: string[]): Promise<number[][]>;
}
