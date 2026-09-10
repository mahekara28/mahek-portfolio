import Link from "next/link";

export default function LLMRoutingPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <nav className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-white"
          >
            Mahek Ara
          </Link>

          <Link
            href="/blog"
            className="font-mono text-xs text-white/35 transition hover:text-emerald-300"
          >
            ← Blog
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="px-6">
        <div className="mx-auto max-w-3xl">
          {/* Intro */}
          <header className="pb-16 pt-20 sm:pt-28">
            <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
              <span className="text-emerald-300/70">AI Engineering</span>
              <span>·</span>
              <span>September 2026</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Your LLM Doesn&apos;t Need More Intelligence.
              <span className="block text-white/40">
                It Needs Better Routing.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              I started thinking about this while building LLM-based systems:
              why should every request go to the biggest model available?
            </p>

            <div className="mt-8 flex items-center gap-3 font-mono text-xs text-white/25">
              <span className="text-emerald-300/60">~</span>
              <span>6 min read</span>
            </div>
          </header>

          {/* Article body */}
          <div className="border-t border-white/10 pb-24 pt-14">
            <Section>
              <p>
                A simple question can be answered by a small model. A
                complicated coding problem probably shouldn&apos;t be.
              </p>

              <p>
                But if your application sends both requests to the same model,
                you&apos;re essentially treating every user request as equally
                difficult.
              </p>

              <p>
                That works for a prototype. It gets expensive once the
                application grows.
              </p>
            </Section>

            {/* Architecture */}
            <Diagram />

            <Section>
              <p>
                The idea is pretty simple: put a small routing layer before the
                actual models.
              </p>

              <p>
                It looks at the request and decides{" "}
                <span className="text-emerald-300/80">
                  where it should go.
                </span>
              </p>

              <p>Something like:</p>

              <CodeBlock
                code={`if complexity == "low":
    model = small_model

elif complexity == "medium":
    model = general_model

else:
    model = reasoning_model`}
              />

              <p>
                Nothing revolutionary here. The interesting part is what this
                changes at the{" "}
                <span className="text-emerald-300/80">system level.</span>
              </p>
            </Section>

            <Section title="A router doesn't need to solve the problem">
              <p>This was the part I found most interesting.</p>

              <p>
                The router isn&apos;t responsible for generating the final
                answer. It only needs to make one decision well:
              </p>

              <p className="border-l border-emerald-400/40 pl-5 text-white/75">
                which model should handle this?
              </p>

              <p>
                That means the routing model can be much smaller and cheaper
                than the models doing the actual work.
              </p>

              <CodeBlock
                language="python"
                code={`def route(prompt):
    task = classify(prompt)

    routes = {
        "simple": "small-model",
        "general": "mid-model",
        "complex": "large-model",
    }

    return routes[task]`}
              />
            </Section>

            <Section title="But routing isn't free">
              <p>There&apos;s a catch.</p>

              <p>
                You&apos;ve added another step before the answer. That means
                extra latency, and the router can get the decision wrong.
              </p>

              <p>
                So I wouldn&apos;t optimise for{" "}
                <span className="text-emerald-300">
                  &quot;always use the cheapest model.&quot;
                </span>
              </p>

              <p>I&apos;d optimise for something closer to:</p>

              <CodeBlock
                language="objective"
                code={`lowest cost
+
lowest latency
+
acceptable answer quality`}
              />

              <p>
                If a request genuinely needs a stronger model, send it there.
                The point is not to avoid expensive models. It&apos;s to stop
                using them when they aren&apos;t necessary.
              </p>
            </Section>

            <Section title="Where this gets interesting">
              <p>
                The basic router is easy. The harder question is what happens
                after the model responds.
              </p>

              <p>
                You could evaluate the answer and escalate when it
                isn&apos;t good enough.
              </p>

              <Diagram
                secondary
                code={`             user
               │
               ▼
             router
          ┌────┼────┐
          ▼    ▼    ▼
        small mid  large
          │    │    │
          └────┼────┘
               ▼
            evaluate
               │
          ┌────┴────┐
          │         │
         good      retry
          │         │
          ▼         ▼
        answer   stronger model`}
              />

              <p>
                At that point, it stops feeling like a model selector and
                starts looking more like an{" "}
                <span className="text-emerald-300/80">
                  inference control layer.
                </span>
              </p>
            </Section>

            <Section title="What I'd measure">
              <p>
                If I actually put this into production, I&apos;d watch a few
                things closely:
              </p>

              <ul className="my-8 space-y-3 font-mono text-sm text-white/50">
                <li>
                  <span className="mr-3 text-emerald-400">01</span>
                  routing accuracy
                </li>
                <li>
                  <span className="mr-3 text-emerald-400">02</span>
                  average latency
                </li>
                <li>
                  <span className="mr-3 text-emerald-400">03</span>
                  cost per request
                </li>
                <li>
                  <span className="mr-3 text-emerald-400">04</span>
                  answer quality
                </li>
                <li>
                  <span className="mr-3 text-emerald-400">05</span>
                  escalation rate
                </li>
              </ul>

              <p>
                Saving tokens doesn&apos;t mean much if answer quality drops.
                And a cheaper model isn&apos;t really cheaper if you end up
                retrying the request three times.
              </p>
            </Section>

            <Section>
              <p>
                I think this is one of those ideas that becomes more useful as
                LLM applications become less of a single-model wrapper and
                more of an actual system.
              </p>

              <p>We keep asking how to make models smarter.</p>

              <p className="text-xl leading-8 text-emerald-300 sm:text-2xl">
                I&apos;m more interested in what happens when the system gets
                better at deciding{" "}
                <em className="text-emerald-200">
                  when intelligence is actually needed.
                </em>
              </p>
            </Section>

            {/* Footer */}
            <div className="mt-16 border-t border-white/10 pt-10">
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/40">
                More from me
              </div>

              <p className="text-sm leading-6 text-white/35">
                I&apos;m building and writing about AI systems, agents and
                developer tooling.
              </p>

              <div className="mt-5 flex gap-5 text-sm">
                <Link
                  href="/#work"
                  className="text-emerald-300 underline decoration-emerald-300/30 underline-offset-4 transition hover:text-emerald-200"
                >
                  View my work
                </Link>

                <Link
                  href="/blog"
                  className="text-white/35 transition hover:text-white"
                >
                  More writing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

/* -------------------------------- */
/* Article Section                  */
/* -------------------------------- */

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      {title && (
        <h2 className="mb-5 text-xl font-medium tracking-tight text-white">
          <span className="mr-2 text-emerald-400/60">/</span>
          {title}
        </h2>
      )}

      <div className="space-y-5 text-[16px] leading-8 text-white/55">
        {children}
      </div>
    </section>
  );
}

/* -------------------------------- */
/* Architecture Diagram             */
/* -------------------------------- */

function Diagram({
  secondary = false,
  code,
}: {
  secondary?: boolean;
  code?: string;
}) {
  const diagramCode =
    code ||
    `                    USER REQUEST
                         │
                         ▼
                  ┌────────────┐
                  │   ROUTER   │
                  └──────┬─────┘
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
        ┌─────────┐ ┌─────────┐ ┌─────────┐
        │  SMALL  │ │ GENERAL │ │  LARGE  │
        │  MODEL  │ │  MODEL  │ │  MODEL  │
        └─────────┘ └─────────┘ └─────────┘`;

  return (
    <div
      className={`my-14 overflow-hidden rounded-lg border ${
        secondary
          ? "border-emerald-400/10 bg-[#050b07]"
          : "border-emerald-400/15 bg-[#061009]"
      }`}
    >
      {/* Diagram header */}
      <div className="flex items-center justify-between border-b border-emerald-400/10 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/50">
          {secondary ? "evaluation flow" : "architecture"}
        </span>

        <span className="font-mono text-[10px] text-white/20">
          {secondary ? "escalation" : "llm-routing"}
        </span>
      </div>

      {/* Diagram */}
      <div className="overflow-x-auto p-6 sm:p-10">
        <pre className="min-w-[620px] font-mono text-xs leading-7 sm:text-sm">
          {diagramCode.split("\n").map((line, index) => (
            <div key={index}>
              {highlightDiagramLine(line)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Diagram Highlighting             */
/* -------------------------------- */

function highlightDiagramLine(line: string) {
  const isArrow =
    line.includes("▼") ||
    line.includes("│") ||
    line.includes("┼") ||
    line.includes("┴") ||
    line.includes("┌") ||
    line.includes("└");

  const isImportant =
    line.includes("ROUTER") ||
    line.includes("SMALL") ||
    line.includes("GENERAL") ||
    line.includes("LARGE") ||
    line.includes("evaluate") ||
    line.includes("stronger model");

  if (isImportant) {
    const parts = line.split(
      /(ROUTER|SMALL|GENERAL|LARGE|evaluate|stronger model)/
    );

    return parts.map((part, index) => {
      if (
        [
          "ROUTER",
          "SMALL",
          "GENERAL",
          "LARGE",
          "evaluate",
          "stronger model",
        ].includes(part)
      ) {
        return (
          <span key={index} className="text-emerald-300">
            {part}
          </span>
        );
      }

      return (
        <span key={index} className="text-white/35">
          {part}
        </span>
      );
    });
  }

  return (
    <span className={isArrow ? "text-emerald-400/60" : "text-white/30"}>
      {line}
    </span>
  );
}

/* -------------------------------- */
/* Code Block                       */
/* -------------------------------- */

function CodeBlock({
  code,
  language = "python",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-emerald-400/15 bg-[#061009]">
      {/* Code header */}
      <div className="flex items-center justify-between border-b border-emerald-400/10 px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/50">
          {language}
        </span>

        <span className="font-mono text-[10px] text-white/20">
          code
        </span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
        <code>
          {code.split("\n").map((line, index) => (
            <div key={index} className="flex">
              <span className="mr-6 w-5 shrink-0 select-none text-right text-white/15">
                {index + 1}
              </span>

              <span className="text-white/60">
                {highlightCode(line)}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* -------------------------------- */
/* Lightweight Syntax Highlighting  */
/* -------------------------------- */

function highlightCode(line: string) {
  const parts = line.split(
    /(\bdef\b|\bif\b|\belif\b|\belse\b|\breturn\b|\bclass\b|\bfor\b|\bin\b|\bimport\b|\bfrom\b|".*?"|'.*?')/
  );

  return parts.map((part, index) => {
    if (
      [
        "def",
        "if",
        "elif",
        "else",
        "return",
        "class",
        "for",
        "in",
        "import",
        "from",
      ].includes(part)
    ) {
      return (
        <span key={index} className="text-emerald-300">
          {part}
        </span>
      );
    }

    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'"))
    ) {
      return (
        <span key={index} className="text-lime-300/80">
          {part}
        </span>
      );
    }

    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-emerald-300/30">
          {part}
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}