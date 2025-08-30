import { DocumentStore } from "@/domain/ports/document_store";

export async function listDocuments(deps: { docs: DocumentStore }) {
  const all = await deps.docs.list();
  return all
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size,
      createdAt: d.createdAt,
    }));
}
