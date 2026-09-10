
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/10 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em]">
            MAHEK ARA
          </Link>

          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-32 lg:px-10">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-white/35">
          About
        </p>

        <h1 className="text-5xl font-medium tracking-tight md:text-7xl">
          I build AI systems
          <br />
          and learn by shipping.
        </h1>

        <div className="mt-16 max-w-2xl space-y-6 text-lg leading-relaxed text-white/55">
          <p>
            I have a B.Tech background in Artificial Intelligence and
            experience working with real-world operational systems.
          </p>

          <p>
            That combination pushed me toward building intelligent tools,
            experimenting with LLMs and understanding how AI systems behave
            beyond simple prompts.
          </p>

          <p>
            Today I'm focused on AI engineering, LLM applications,
            AI security and intelligent automation.
          </p>
        </div>
      </section>
    </main>
  );
}
