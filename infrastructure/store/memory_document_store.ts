import { Document } from "@/domain/models/document";
import { DocumentStore } from "@/domain/ports/document_store";

export class InMemoryDocumentStore implements DocumentStore {
  private data: Map<string, Document> = new Map();

  async add(doc: Document) {
    this.data.set(doc.id, doc);
  }

  async list() {
    return Array.from(this.data.values());
  }

  async get(id: string) {
    return this.data.get(id) ?? null;
  }

  async remove(id: string) {
    this.data.delete(id);
  }
}
