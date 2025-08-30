"use server";

import { Document } from "@/domain/models/document";
import { DocumentStore } from "@/domain/ports/document_store";
import { FileStorage } from "@/domain/ports/file_storage";
import { TextExtractor } from "@/domain/ports/text_extractor";
import crypto from "crypto";

export async function uploadDocument(
  deps: { docs: DocumentStore; files: FileStorage; extractor: TextExtractor },
  input: { filename: string; bytes: Uint8Array; mime?: string },
) {
  const id = crypto.randomUUID();
  const ext = input.filename.split(".").pop()?.toLowerCase() ?? "";
  const type = (ext === "pdf" ? "pdf" : "txt") as Document["type"];
  const storagePath = `uploads/${id}.${ext || "bin"}`;

  await deps.files.saveBytes(storagePath, input.bytes);

  const textRaw = await deps.extractor.extract({
    bytes: input.bytes,
    filename: input.filename,
    mime: input.mime,
  });

  const text = normalize(textRaw);

  const doc: Document = {
    id,
    name: input.filename,
    type,
    size: input.bytes.byteLength,
    createdAt: Date.now(),
    text,
  };

  await deps.docs.add(doc);

  return { id };
}

function normalize(s: string) {
  return s.replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").trim();
}
