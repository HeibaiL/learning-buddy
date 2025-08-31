export function chunkText(text: string, opts?: { size?: number; overlap?: number }) {
  const size = opts?.size ?? 800,
    overlap = opts?.overlap ?? 100;
  const clean = text.replace(/\s+/g, " ").trim();
  const out: string[] = [];

  Array.from({ length: Math.ceil(clean.length / (size - overlap)) })
    .map((_, idx) => idx * (size - overlap))
    .forEach((i) => out.push(clean.slice(i, i + size)));
  return out;
}
