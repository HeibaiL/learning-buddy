import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Learning Buddy</h1>
        <p className="max-w-prose text-lg text-white/70">
          A simple clean-architecture demo with Next.js + OpenAI. Chat with your personal AI study
          assistant.
        </p>
        <Link
          href="/docs"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400"
        >
          Upload docs
        </Link>

        <footer className="mt-12 text-sm text-white/40">
          Built with Next.js · Clean Architecture · OpenAI
        </footer>
      </div>
    </main>
  );
}
