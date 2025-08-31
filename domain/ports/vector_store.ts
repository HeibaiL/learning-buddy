export type Vector = {
  metadata: {
    docId: string;
    name: string;
    idx: number;
    text: string;
  };
  v: Float32Array;
  id: string;
};

export interface VectorStore {
  add(id: string, vector: number[], metadata?: Vector["metadata"]): Promise<void>;
  search(
    query: number[],
    topK: number,
  ): Promise<Array<{ id: string; score: number; metadata?: any }>>;
  size(): Promise<number>;
  clear?(): Promise<void>;
}
