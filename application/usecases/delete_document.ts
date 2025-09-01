import { DocumentStore } from "@/domain/ports/document_store";
import { FileStorage } from "@/domain/ports/file_storage";

export async function deleteDocument(
  deps: { docs: DocumentStore; files: FileStorage },
  id: string,
) {
  await deps.docs.remove(id);
  return { ok: true };
}
