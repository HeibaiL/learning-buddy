"use server";

import "server-only";

import { getContainer } from "@/infrastructure/di/container";
import { listDocuments } from "@/application/usecases/list_documents";
import { deleteDocument } from "@/application/usecases/delete_document";
import { uploadDocument } from "@/application/usecases/upload_documents";
import { prepareStudyContext } from "@/application/usecases/prepare_context";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = new Set(["application/pdf", "text/plain"]);

export async function uploadAction(formData: FormData) {
  const file = formData.get("file") as unknown as File | null;
  if (!file) throw new Error("No file provided");

  const mime = file.type || undefined;
  if (mime && !ALLOWED.has(mime)) throw new Error("Only PDF or TXT allowed");

  if (file.size > MAX_SIZE) throw new Error("File too large");

  const buf = new Uint8Array(await file.arrayBuffer());

  const c = getContainer();

  const { id } = await uploadDocument(
    { docs: c.documentStore, files: c.fileStorage, extractor: c.extractor },
    { filename: file.name, bytes: buf, mime },
  );

  return { id };
}

export async function listDocsAction() {
  const c = getContainer();
  return listDocuments({ docs: c.documentStore });
}

export async function deleteDocAction(id: string) {
  const c = getContainer();
  await deleteDocument({ docs: c.documentStore, files: c.fileStorage }, id);
  return { ok: true };
}

export async function prepareContextAction(title?: string) {
  const c = getContainer();
  console.log(c.contextStore);
  const res = await prepareStudyContext(
    { docs: c.documentStore, ctx: c.contextStore, llm: c.llm },
    { title },
  );
  return res;
}
