import { TextExtractor } from "@/domain/ports/text_extractor";
import pdf from "pdf-parse";

export class BasicTextExtractor implements TextExtractor {
  async extract(params: { bytes: Uint8Array; filename: string; mime?: string }): Promise<string> {
    const ext = params.filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      const buf = Buffer.from(params.bytes);
      const res = await pdf(buf);
      return res.text;
    }
    if (ext === "txt") {
      return new TextDecoder("utf-8").decode(params.bytes);
    }
    throw new Error(`Unsupported file type: ${ext}`);
  }
}
