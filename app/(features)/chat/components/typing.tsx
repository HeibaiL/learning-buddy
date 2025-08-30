export function Typing() {
  return (
    <div className="mt-2 flex items-center gap-2 text-white/60">
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-200ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-100ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
      <span className="ml-2 text-sm">Assistant is typing…</span>
    </div>
  );
}
