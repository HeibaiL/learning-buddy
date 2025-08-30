import ChatClient from "@/app/(features)/chat/chat-client";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-white">
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <header className="mb-4 flex items-center justify-between rounded-xl bg-neutral-900/60 px-4 py-3 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <h1 className="text-lg font-semibold">Learning Buddy</h1>
            <span className="text-xs text-white/50">Clean Architecture demo</span>
          </div>
        </header>
        <ChatClient />
      </div>
    </main>
  );
}
