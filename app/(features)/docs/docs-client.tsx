"use client";

import { useEffect, useRef, useState } from "react";
import { deleteDocAction, listDocsAction, prepareContextAction, uploadAction } from "./actions";
import { useRouter } from "next/navigation";

type DocItem = { id: string; name: string; type: "pdf" | "txt"; size: number; createdAt: number };

export default function DocsClient() {
  const router = useRouter();
  const [preparing, setPreparing] = useState(false);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const list = await listDocsAction();

    setDocs(list as any);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const file = files[0];

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);
    try {
      await uploadAction(fd);
      await refresh();
    } catch (e: any) {
      console.log(e);
      alert(e?.message ?? "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
      setDragOver(false);
    }
  }

  return (
    <section className="grid gap-6">
      {/* Uploader */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={[
          "rounded-2xl border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-emerald-500 bg-emerald-500/10" : "border-white/15 bg-neutral-950/40",
        ].join(" ")}
      >
        <div className="mb-3 text-lg font-medium">Upload a document</div>
        <p className="mb-4 text-sm text-white/60">PDF or TXT, up to 10MB</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Choose File"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,text/plain,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="text-sm text-white/40">or drag & drop here</span>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl bg-neutral-950/40 ring-1 ring-white/10">
        <div className="border-b border-white/10 px-4 py-3 text-sm text-white/60">
          {docs.length} document{docs.length !== 1 ? "s" : ""}
        </div>
        <ul className="divide-y divide-white/10">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-white/50">
                  {d.type.toUpperCase()} · {(d.size / 1024).toFixed(1)} KB ·{" "}
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={async () => {
                  await deleteDocAction(d.id);
                  await refresh();
                }}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm text-white/80 ring-1 ring-white/10 hover:bg-neutral-700"
              >
                Delete
              </button>
            </li>
          ))}
          {docs.length === 0 && (
            <li className="px-4 py-6 text-center text-white/50">No documents yet</li>
          )}
        </ul>

        <button
          type="button"
          disabled={preparing}
          onClick={async () => {
            try {
              setPreparing(true);
              const r = await prepareContextAction("Study Pack");
              // опційно: toast/alert
              // alert(`Context prepared: ${r.title}`);
              router.push("/chat"); // ⬅️ одразу йдемо в чат
            } catch (e: any) {
              alert(e?.message ?? "Failed to prepare context");
            } finally {
              setPreparing(false);
            }
          }}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {preparing ? "Preparing…" : "Prepare for Chat →"}
        </button>
      </div>
    </section>
  );
}
