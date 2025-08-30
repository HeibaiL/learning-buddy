"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { askAction, historyAction, clearAction } from "./actions";
import { Typing, EmptyState, Bubble } from "./components";

type Msg = { id: string; role: "user" | "assistant"; content: string; createdAt: number };

export default function ChatClient() {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getMessages = async () => {
      const list = await historyAction();
      setMsgs(list as any);
    };

    getMessages();
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  async function load() {
    const list = await historyAction();
    setMsgs(list as any);
  }

  async function onAsk() {
    const q = text.trim();
    if (!q || loading) return;
    setLoading(true);
    setText("");
    const tempId = crypto.randomUUID();
    setMsgs((prev) => [...prev, { id: tempId, role: "user", content: q, createdAt: Date.now() }]);
    try {
      await askAction(q);
      await load();
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  }

  const empty = useMemo(() => msgs.length === 0, [msgs]);

  return (
    <section className="grid gap-4">
      <div
        ref={listRef}
        className="h-[60vh] overflow-y-auto rounded-xl bg-neutral-950/40 p-3 ring-1 ring-white/10"
      >
        {empty ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {msgs.map((m) => (
              <Bubble key={m.id} role={m.role} text={m.content} />
            ))}
            {loading && <Typing />}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
          className="min-h-12 max-h-40 flex-1 resize-y rounded-xl bg-neutral-900/70 px-4 py-3 text-base outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-emerald-500"
          rows={1}
        />
        <button
          onClick={onAsk}
          disabled={loading || !text.trim()}
          className="h-12 rounded-xl bg-emerald-600 px-5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-emerald-500"
        >
          {loading ? "Thinking…" : "Send"}
        </button>
        <button
          onClick={async () => {
            await clearAction();
            await load();
          }}
          className="h-12 rounded-xl bg-neutral-800 px-4 text-sm text-white/90 ring-1 ring-white/10 hover:bg-neutral-700"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
