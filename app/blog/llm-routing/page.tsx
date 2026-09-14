"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "../../theme-provider";

export default function LLMRoutingPage() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#140d10] text-[#efe1d6]" : "bg-[#f3e9df] text-[#24181a]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-[320px] w-[320px] rounded-full bg-[#5a4558]/18 blur-[130px]" />
        <div className="absolute -right-44 top-16 h-[420px] w-[420px] rounded-full bg-[#6f2f3d]/22 blur-[130px]" />
        <div className="absolute -left-36 bottom-0 h-[320px] w-[320px] rounded-full bg-[#4f3946]/18 blur-[120px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(126,63,76,0.13),transparent_34%),radial-gradient(circle_at_top_right,rgba(212,178,159,0.04),transparent_28%)]" />

      <nav
        className={`relative z-20 border-b px-4 py-5 sm:px-6 md:px-10 ${
          isDark ? "border-[#d4b29f]/10" : "border-black/10"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition ${
              isDark
                ? "border-[#d4b29f]/18 text-[#efe1d6] hover:border-[#d4b29f]/34 hover:text-[#f5e7db]"
                : "border-[#7e3f4c]/16 text-[#24181a] hover:border-[#7e3f4c]/32 hover:text-[#7e3f4c]"
            }`}
          >
            MA
          </Link>

          <Link
            href="/blog"
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition ${
              isDark
                ? "border-[#d4b29f]/12 text-[#efe1d6]/44 hover:border-[#d4b29f]/30 hover:bg-[#d4b29f]/[0.04] hover:text-[#f5e7db]"
                : "border-[#7e3f4c]/12 text-black/45 hover:border-[#7e3f4c]/28 hover:bg-[#7e3f4c]/[0.04] hover:text-[#7e3f4c]"
            }`}
          >
            Back to blog
          </Link>
        </div>
      </nav>

      <article className="relative z-10 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          <header
            className={`grid gap-12 border-b pb-12 pt-14 md:grid-cols-[190px_minmax(0,1fr)] md:pb-16 md:pt-20 ${
              isDark ? "border-[#d4b29f]/10" : "border-black/10"
            }`}
          >
            <div className="space-y-6">
              <MetaBlock
                label="Category"
                value="AI Engineering"
                highlight
                isDark={isDark}
              />
              <MetaBlock
                label="Published"
                value="September 2026"
                isDark={isDark}
              />
              <MetaBlock
                label="Read time"
                value="6 min read"
                isDark={isDark}
              />
            </div>

            <div>
              <div
                className={`text-[10px] uppercase tracking-[0.22em] ${
                  isDark ? "text-[#d4b29f]" : "text-[#8b4652]"
                }`}
              >
                Essay 01
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-5xl md:text-6xl">
                Your LLM doesn&apos;t need more intelligence.
                <span
                  className={`block ${
                    isDark ? "text-[#b88388]" : "text-[#8b4652]"
                  }`}
                >
                  It needs better routing.
                </span>
              </h1>

              <p
                className={`mt-7 max-w-2xl text-base leading-8 sm:text-lg ${
                  isDark ? "text-[#efe1d6]/60" : "text-black/62"
                }`}
              >
                I kept coming back to one annoying question while building LLM
                systems: why do we keep sending every request to the biggest
                model we have, even when the task clearly doesn&apos;t need it?
              </p>
            </div>
          </header>

          <div className="grid gap-14 py-12 md:grid-cols-[190px_minmax(0,1fr)] md:py-16">
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-[#efe1d6]/30" : "text-black/36"
                  }`}
                >
                  In this note
                </div>

                <div
                  className={`mt-5 space-y-3 text-sm ${
                    isDark ? "text-[#efe1d6]/48" : "text-black/56"
                  }`}
                >
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
                  That feels fine in a demo. It starts to feel wasteful the
                  moment the product gets real users, real traffic, and real
                  latency complaints.
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
                  feeling like a classifier and started feeling more like
                  control logic.
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

                <p
                  className={`text-xl leading-8 sm:text-2xl ${
                    isDark ? "text-[#d4b29f]" : "text-[#8b4652]"
                  }`}
                >
                  More like: how do I make the system better at deciding when
                  intelligence is actually needed?
                </p>
              </Section>

              <footer
                className={`mt-16 border-t pt-10 ${
                  isDark ? "border-[#d4b29f]/10" : "border-black/10"
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isDark ? "text-[#efe1d6]/30" : "text-black/36"
                  }`}
                >
                  More writing
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    href="/blog"
                    className={`transition ${
                      isDark
                        ? "text-[#efe1d6]/48 hover:text-[#f5e7db]"
                        : "text-black/55 hover:text-black"
                    }`}
                  >
                    Back to archive
                  </Link>

                  <Link
                    href="/projects"
                    className={`transition ${
                      isDark
                        ? "text-[#d4b29f] hover:text-[#f5e7db]"
                        : "text-[#8b4652] hover:text-[#7e3f4c]"
                    }`}
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

function MetaBlock({
  label,
  value,
  highlight = false,
  isDark,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isDark: boolean;
}) {
  return (
    <div>
      <div
        className={`text-[10px] uppercase tracking-[0.18em] ${
          isDark ? "text-[#efe1d6]/30" : "text-black/36"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 text-sm ${
          highlight
            ? isDark
              ? "text-[#d4b29f]"
              : "text-[#8b4652]"
            : isDark
              ? "text-[#efe1d6]/60"
              : "text-black/60"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  isDark,
}: {
  title?: string;
  children: ReactNode;
  isDark: boolean;
}) {
  return (
    <section className="mb-14">
      {title && (
        <h2 className="mb-5 text-xl font-medium tracking-tight sm:text-2xl">
          {title}
        </h2>
      )}
      <div
        className={`space-y-5 text-[16px] leading-8 ${
          isDark ? "text-[#efe1d6]/60" : "text-black/66"
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
  children: ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`my-8 border-l pl-5 text-lg leading-8 ${
        isDark
          ? "border-[#8b4652]/50 text-[#efe1d6]/82"
          : "border-[#8b4652]/40 text-black/82"
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
    <ul
      className={`my-8 space-y-3 text-[15px] ${
        isDark ? "text-[#efe1d6]/58" : "text-black/66"
      }`}
    >
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-3">
          <span
            className={`font-mono text-xs ${
              isDark ? "text-[#d4b29f]/76" : "text-[#8b4652]/76"
            }`}
          >
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
            ? "border-[#d4b29f]/10 bg-white/[0.02]"
            : "border-black/10 bg-white/55"
          : isDark
            ? "border-[#8b4652]/18 bg-[#191115]"
            : "border-[#8b4652]/14 bg-[#fbf4ef]"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-3 ${
          isDark ? "border-[#d4b29f]/8" : "border-black/8"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            isDark ? "text-[#efe1d6]/34" : "text-black/40"
          }`}
        >
          {secondary ? "escalation flow" : "routing sketch"}
        </span>
        <span
          className={`font-mono text-[10px] ${
            isDark ? "text-[#efe1d6]/22" : "text-black/28"
          }`}
        >
          {secondary ? "system view" : "architecture"}
        </span>
      </div>

      <div className="overflow-x-auto p-6 sm:p-8">
        <pre
          className={`min-w-[420px] font-mono text-xs leading-7 sm:text-sm ${
            isDark ? "text-[#efe1d6]/54" : "text-black/62"
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
        isDark
          ? "border-[#d4b29f]/10 bg-white/[0.02]"
          : "border-black/10 bg-white/60"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark ? "border-[#d4b29f]/8" : "border-black/8"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            isDark ? "text-[#efe1d6]/34" : "text-black/40"
          }`}
        >
          {language}
        </span>
        <span
          className={`font-mono text-[10px] ${
            isDark ? "text-[#efe1d6]/22" : "text-black/28"
          }`}
        >
          snippet
        </span>
      </div>

      <pre
        className={`overflow-x-auto p-5 font-mono text-[13px] leading-7 ${
          isDark ? "text-[#efe1d6]/68" : "text-black/72"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}