import Link from "next/link";

const posts = [
  {
    title: "Your LLM Doesn't Need More Intelligence. It Needs Better Routing.",
    description:
      "I built an LLM router and realized that model selection isn't really a classification problem. It's a systems problem.",
    category: "AI Engineering",
    readTime: "7 min read",
    href: "/blog/llm-routing",
  },
  {
    title: "Why My LLM Took 6 Seconds to Answer",
    description:
      "A technical investigation into latency, inference, and what actually happens between a request and an LLM response.",
    category: "AI Systems",
    readTime: "Coming soon",
    href: "#",
  },
  {
    title: "Testing Prompt Injection Attacks",
    description:
      "What happens when an AI system is deliberately given instructions it shouldn't follow?",
    category: "AI Security",
    readTime: "Coming soon",
    href: "#",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/10 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.2em]"
          >
            MAHEK ARA
          </Link>

          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-white/35">
          Writing
        </p>

        <h1 className="mt-8 text-6xl font-medium tracking-tight md:text-8xl">
          Notes &
          <br />
          experiments.
        </h1>

        <div className="mt-20">
          {posts.map((post, index) => {
            const isAvailable = post.href !== "#";

            return (
              <article
                key={post.title}
                className="group border-t border-white/10 py-8"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <span className="text-xs text-white/30">
                      0{index + 1}
                    </span>

                    {isAvailable ? (
                      <Link href={post.href} className="block">
                        <h2 className="mt-3 text-2xl font-medium tracking-tight transition group-hover:text-[#9cff57] md:text-4xl">
                          {post.title}
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
                          {post.description}
                        </p>

                        <div className="mt-5 flex gap-4 text-xs uppercase tracking-[0.15em] text-white/25">
                          <span>{post.category}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                      </Link>
                    ) : (
                      <>
                        <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-4xl">
                          {post.title}
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
                          {post.description}
                        </p>

                        <div className="mt-5 flex gap-4 text-xs uppercase tracking-[0.15em] text-white/25">
                          <span>{post.category}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {isAvailable && (
                    <span className="hidden pt-7 text-xl text-white/20 transition group-hover:translate-x-1 group-hover:text-[#9cff57] md:block">
                      ↗
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}