"use client";

import Link from "next/link";
import { useTheme } from "../../theme-provider";

export default function LLMRoutingPage() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#060806] text-white" : "bg-[#f4f7f2] text-[#0f1411]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -right-40 top-20 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? "bg-emerald-500/[0.05]" : "bg-emerald-500/[0.10]"
          }`}
        />
        <div
          className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[130px] ${
            isDark ? "bg-emerald-400/[0.04]" : "bg-emerald-400/[0.08]"
          }`}
        />
      </div>

      <nav
        className={`relative z-20 border-b px-4 py-5 sm:px-6 md:px-10 ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition ${
              isDark
                ? "border-white/15 text-white hover:border-emerald-400 hover:text-emerald-300"
                : "border-black/15 text-[#0f1411] hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            MA
          </Link>

          <Link
            href="/blog"
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition ${
              isDark
                ? "border-white/10 text-white/40 hover:border-emerald-400/35 hover:bg-emerald-400/10 hover:text-emerald-300"
                : "border-black/10 text-black/45 hover:border-emerald-600/25 hover:bg-emerald-500/8 hover:text-emerald-700"
            }`}
          >
            Back to blog
          </Link>
        </div>
      </nav>

      <article className="relative z-10 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          <header
            className={`grid gap-12 border-b pb-12 pt-14 md:grid-cols-[180px_minmax(0,1fr)] md:pb-16 md:pt-20 ${
              isDark ? "border-white/10" : "border-black/10"
            }`}
          >
            <div className="space-y-6">
              <div>
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  Category
                </div>
                <div className={isDark ? "mt-2 text-sm text-emerald-300/80" : "mt-2 text-sm text-emerald-700/85"}>
                  AI Engineering
                </div>
              </div>

              <div>
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  Published
                </div>
                <div className={isDark ? "mt-2 text-sm text-white/58" : "mt-2 text-sm text-black/60"}>
                  September 2026
                </div>
              </div>

              <div>
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  Read time
                </div>
                <div className={isDark ? "mt-2 text-sm text-white/58" : "mt-2 text-sm text-black/60"}>
                  6 min read
                </div>
              </div>
            </div>

            <div>
              <div className={isDark ? "text-[10px] uppercase tracking-[0.22em] text-emerald-400/80" : "text-[10px] uppercase tracking-[0.22em] text-emerald-700/85"}>
                Essay 01
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-5xl md:text-6xl">
                Your LLM doesn&apos;t need more intelligence.
                <span className={isDark ? "block text-white/38" : "block text-black/38"}>
                  It needs better routing.
                </span>
              </h1>

              <p className={isDark ? "mt-7 max-w-2xl text-base leading-8 text-white/50 sm:text-lg" : "mt-7 max-w-2xl text-base leading-8 text-black/62 sm:text-lg"}>
                I kept coming back to one annoying question while building LLM
                systems: why do we keep sending every request to the biggest
                model we have, even when the task clearly doesn&apos;t need it?
              </p>
            </div>
          </header>

          <div className="grid gap-14 py-12 md:grid-cols-[180px_minmax(0,1fr)] md:py-16">
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  In this note
                </div>

                <div className={isDark ? "mt-5 space-y-3 text-sm text-white/46" : "mt-5 space-y-3 text-sm text-black/56"}>
                  <div>The real problem</div>
                  <div>What a router should do</div>
                  <div>Why cheap isn&apos;t the goal</div>
                  <div>Where it gets interesting</div>
                  <div>What I&apos;d measure</div>
                </div>
              </div>
            </aside>

            <div className="max-w-3xl">
              <Section isDark={isDark}>
                <p>
                  A simple question can be answered by a small model. A messy
                  reasoning task probably can&apos;t.
                </p>

                <p>
                  But a lot of LLM products still behave as if every prompt is
                  equally difficult. Everything goes to the same expensive
                  model, every time.
                </p>

                <p>
                  That is fine in a demo. It starts to feel wasteful the moment
                  the product gets real users, real traffic, and real latency
                  complaints.
                </p>
              </Section>

              <Diagram isDark={isDark} />

              <Section title="The basic idea" isDark={isDark}>
                <p>
                  Put a routing layer in front of the models. Let that layer
                  decide where a request should go before inference starts.
                </p>

                <p>
                  The logic itself is not the exciting part. It can be as simple
                  as:
                </p>

                <CodeBlock
                  isDark={isDark}
                  code={`if complexity == "low":
    model = small_model

elif complexity == "medium":
    model = general_model

else:
    model = reasoning_model`}
                />

                <p>
                  On paper, this looks obvious. What makes it useful is not the
                  code. It&apos;s the change in mindset.
                </p>
              </Section>

              <Section title="The shift that matters" isDark={isDark}>
                <p>
                  A router does not need to solve the user&apos;s problem. It only
                  needs to make one decision well:
                </p>

                <Quote isDark={isDark}>
                  Which model is worth using for this request?
                </Quote>

                <p>
                  That one shift changes the economics of the whole system. The
                  routing layer can be small, fast, and cheap, because it is not
                  responsible for the final answer.
                </p>

                <p>
                  Once I started looking at it this way, the router stopped
                  feeling like a classifier and started feeling like control
                  logic.
                </p>
              </Section>

              <Section title="Routing is not free" isDark={isDark}>
                <p>
                  There is still a cost to doing this. You are inserting another
                  step before the answer, which means extra latency and another
                  chance to make a bad call.
                </p>

                <p>
                  So I would not optimize for &quot;always use the cheapest
                  model.&quot; That goal sounds smart and usually produces a brittle
                  system.
                </p>

                <p>I&apos;d rather optimize for a rough balance:</p>

                <CodeBlock
                  isDark={isDark}
                  language="objective"
                  code={`lowest reasonable cost
+
+lowest acceptable latency
+
+answer quality that still holds up`}
                />

                <p>
                  If a request genuinely needs a stronger model, send it there
                  without hesitation. The point is not to avoid powerful models.
                  The point is to stop treating them like the default answer to
                  everything.
                </p>
              </Section>

              <Section title="Where it gets more interesting" isDark={isDark}>
                <p>
                  The first version of routing is straightforward. The more
                  interesting question is what happens after the model answers.
                </p>

                <p>
                  If the response looks weak, incomplete, or uncertain, the
                  system could escalate. At that point you are not just routing
                  requests. You are managing inference as a pipeline.
                </p>

                <Diagram
                  isDark={isDark}
                  secondary
                  code={`             user
               |
               v
             router
          /    |    \\
         v     v     v
      small   mid   large
         \\     |     /
          \\    |    /
               v
            evaluate
               |
         good  |  retry
           \\   |   /
            \\  |  /
         stronger model`}
                />

                <p>
                  That is the version I find more compelling. Not just model
                  selection, but a system that knows how to spend intelligence
                  carefully.
                </p>
              </Section>

              <Section title="What I&apos;d watch in production" isDark={isDark}>
                <p>
                  If I shipped this for real, I&apos;d care less about how clever
                  the router looked and more about whether the numbers stayed
                  honest.
                </p>

                <List
                  isDark={isDark}
                  items={[
                    "routing accuracy",
                    "average latency",
                    "cost per request",
                    "answer quality",
                    "escalation rate",
                  ]}
                />

                <p>
                  Saving tokens is not useful if answer quality drops. A cheaper
                  path is not actually cheaper if the system keeps retrying and
                  climbing to a bigger model anyway.
                </p>
              </Section>

              <Section isDark={isDark}>
                <p>
                  I think this becomes more relevant as LLM products mature.
                  Once you stop treating them like single-model wrappers, you
                  start asking better systems questions.
                </p>

                <p>Not &quot;how do I make the model smarter?&quot;</p>

                <p className={isDark ? "text-xl leading-8 text-emerald-300 sm:text-2xl" : "text-xl leading-8 text-emerald-700 sm:text-2xl"}>
                  More like: how do I make the system better at deciding when
                  intelligence is actually needed?
                </p>
              </Section>

              <footer
                className={`mt-16 border-t pt-10 ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  More writing
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    href="/blog"
                    className={isDark ? "text-white/45 transition hover:text-white" : "text-black/55 transition hover:text-black"}
                  >
                    Back to archive
                  </Link>

                  <Link
                    href="/projects"
                    className={isDark ? "text-emerald-300 transition hover:text-emerald-200" : "text-emerald-700 transition hover:text-emerald-800"}
                  >
                    View projects
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
  isDark,
}: {
  title?: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <section className="mb-14">
      {title && <h2 className="mb-5 text-xl font-medium tracking-tight sm:text-2xl">{title}</h2>}
      <div
        className={`space-y-5 text-[16px] leading-8 ${
          isDark ? "text-white/56" : "text-black/66"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function Quote({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`my-8 border-l pl-5 text-lg leading-8 ${
        isDark
          ? "border-emerald-400/40 text-white/78"
          : "border-emerald-600/35 text-black/82"
      }`}
    >
      {children}
    </div>
  );
}

function List({
  items,
  isDark,
}: {
  items: string[];
  isDark: boolean;
}) {
  return (
    <ul className={`my-8 space-y-3 text-[15px] ${isDark ? "text-white/56" : "text-black/66"}`}>
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-3">
          <span className={isDark ? "font-mono text-xs text-emerald-400/70" : "font-mono text-xs text-emerald-700/70"}>
            0{index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Diagram({
  secondary = false,
  code,
  isDark,
}: {
  secondary?: boolean;
  code?: string;
  isDark: boolean;
}) {
  const diagramCode =
    code ||
    `             user request
                  |
                  v
               router
           /      |      \\
          v       v       v
       small   general   large
       model    model    model`;

  return (
    <div
      className={`my-14 overflow-hidden rounded-[24px] border ${
        secondary
          ? isDark
            ? "border-white/10 bg-white/[0.02]"
            : "border-black/10 bg-white/55"
          : isDark
            ? "border-emerald-400/12 bg-[#071009]"
            : "border-emerald-600/14 bg-emerald-50/70"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-3 ${
          isDark ? "border-white/8" : "border-black/8"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            isDark ? "text-white/34" : "text-black/40"
          }`}
        >
          {secondary ? "escalation flow" : "routing sketch"}
        </span>
        <span
          className={`font-mono text-[10px] ${
            isDark ? "text-white/20" : "text-black/28"
          }`}
        >
          {secondary ? "system view" : "architecture"}
        </span>
      </div>

      <div className="overflow-x-auto p-6 sm:p-8">
        <pre
          className={`min-w-[420px] font-mono text-xs leading-7 sm:text-sm ${
            isDark ? "text-white/48" : "text-black/62"
          }`}
        >
          {diagramCode}
        </pre>
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  language = "python",
  isDark,
}: {
  code: string;
  language?: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`my-8 overflow-hidden rounded-[24px] border ${
        isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white/60"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark ? "border-white/8" : "border-black/8"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            isDark ? "text-white/34" : "text-black/40"
          }`}
        >
          {language}
        </span>
        <span
          className={`font-mono text-[10px] ${
            isDark ? "text-white/20" : "text-black/28"
          }`}
        >
          snippet
        </span>
      </div>

      <pre
        className={`overflow-x-auto p-5 font-mono text-[13px] leading-7 ${
          isDark ? "text-white/62" : "text-black/72"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}