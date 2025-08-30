export interface FileStorage {
  saveBytes(path: string, bytes: Uint8Array): Promise<void>;
  remove(path: string): Promise<void>;
}
