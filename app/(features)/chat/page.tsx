import ChatClient from "@/app/(features)/chat/chat-client";

export default function ChatPage() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Chat (без embeddings)</h1>
      <ChatClient />
    </main>
  );
}
