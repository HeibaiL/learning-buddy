export function Bubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-[15px] leading-relaxed",
          isUser
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-neutral-800/80 text-white ring-1 ring-white/10",
        ].join(" ")}
      >
        {!isUser && <span className="mb-1 block text-xs text-white/50">Assistant</span>}
        {text}
      </div>
    </div>
  );
}
