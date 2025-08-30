import { Document } from "@/domain/models/document";

export interface DocumentStore {
  add(doc: Document): Promise<void>;
  list(): Promise<Document[]>;
  get(id: string): Promise<Document | null>;
  remove(id: string): Promise<void>;
}
