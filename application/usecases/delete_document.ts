import { DocumentStore } from "@/domain/ports/document_store";
import { FileStorage } from "@/domain/ports/file_storage";

export async function deleteDocument(
  deps: { docs: DocumentStore; files: FileStorage },
  id: string,
) {
  // ми не зберігаємо шлях у Document; в реалі додай поле path.
  // Для демо просто видаляємо запис зі стору.
  await deps.docs.remove(id);
  return { ok: true };
}
