import { Vector, VectorStore } from "@/domain/ports/vector_store";

export class InMemoryVectorStore implements VectorStore {
  private rows: Vector[] = [];
  async add(id: string, vector: number[], metadata?: any) {
    this.rows.push({ id, v: new Float32Array(vector), metadata });
  }
  async search(query: number[], topK: number) {
    const q = new Float32Array(query);
    const qn = norm(q);
    const scored = this.rows.map((r) => ({
      id: r.id,
      score: cosine(qn, r.v),
      metadata: r.metadata,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
  async size() {
    return this.rows.length;
  }
  async clear() {
    this.rows = [];
  }
}
function norm(v: Float32Array) {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  s = Math.sqrt(s) || 1;
  const o = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) o[i] = v[i] / s;
  return o;
}
function cosine(qn: Float32Array, x: Float32Array) {
  const xn = norm(x);
  let s = 0;
  for (let i = 0; i < qn.length; i++) s += qn[i] * xn[i];
  return s;
}
