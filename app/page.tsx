import Link from "next/link";
export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Learning Buddy — простий чат</h1>
      <p>
        <Link href="/chat">Перейти в чат</Link>
      </p>
    </main>
  );
}
