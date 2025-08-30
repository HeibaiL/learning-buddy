import { FileStorage } from "@/domain/ports/file_storage";

export class InMemoryFileStorage implements FileStorage {
  private files: Map<string, Uint8Array> = new Map();

  async saveBytes(path: string, bytes: Uint8Array) {
    this.files.set(path, bytes);
  }

  async remove(path: string) {
    this.files.delete(path);
  }

  // додатково можна зробити get(path) для дебагу
  get(path: string) {
    return this.files.get(path);
  }
}
