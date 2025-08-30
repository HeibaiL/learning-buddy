"use client";
import { useEffect, useState } from "react";
import { askAction, historyAction, clearAction } from "./actions";

type Msg = { id: string; role: "user" | "assistant"; content: string; createdAt: number };

export default function ChatClient() {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const list = await historyAction();
    setMsgs(list as any);
  }
  useEffect(() => {
    load();
  }, []);

  async function onAsk() {
    if (!text.trim()) return;
    setLoading(true);
    setText("");
    await askAction(text);
    await load();
    setLoading(false);
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid black", padding: 12, minHeight: 180 }}>
        {msgs.length === 0 ? (
          <i>порожньо</i>
        ) : (
          msgs.map((m) => (
            <div key={m.id} style={{ margin: "6px 0" }}>
              <b>{m.role}:</b> {m.content}
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: 8, borderColor: "black", borderWidth: 1 }}
        />
        <button onClick={onAsk} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
        <button
          onClick={async () => {
            await clearAction();
            await load();
          }}
        >
          Clear
        </button>
      </div>
    </section>
  );
}
