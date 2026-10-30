import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CopyButton } from "../../components/article-tools";
import { routingPost } from "../../lib/content";

export const metadata: Metadata = {
  title: routingPost.title,
  description: routingPost.description,
};

const contents = [
  ["the-problem", "What this version does"],
  ["basic-idea", "Before the model call"],
  ["the-shift", "Keep the choice separate"],
  ["routing-cost", "Routing is not free"],
  ["escalation", "After the first answer"],
  ["production", "What I would measure"],
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="essay-section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

function CodeBlock({
  code,
  language = "Python",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-header">
        <span className="mono">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre tabIndex={0} aria-label={`${language} code`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RoutingDiagram({ escalation = false }: { escalation?: boolean }) {
  return (
    <figure className="routing-diagram">
      <figcaption className="mono">
        {escalation
          ? "After the first answer / possible escalation"
          : "Before inference / model selection"}
      </figcaption>
      <div className="diagram-flow">
        <span>User request</span>
        <ArrowDown size={17} aria-hidden="true" />
        <span className="diagram-router">Router</span>
        <ArrowDown size={17} aria-hidden="true" />
        <div className="model-branches">
          <span>Small model</span>
          <span>General model</span>
          <span>Large model</span>
        </div>
        {escalation && (
          <>
            <ArrowDown size={17} aria-hidden="true" />
            <span>Evaluate the response</span>
            <div className="evaluation-branches">
              <span>
                Acceptable
                <br />
                <strong>Return answer</strong>
              </span>
              <span>
                Needs another pass
                <br />
                <strong>Escalate & re-evaluate</strong>
              </span>
            </div>
          </>
        )}
      </div>
    </figure>
  );
}

export default function LLMRoutingPage() {
  return (
    <main id="main" className="md-paper-view essay-main" tabIndex={-1}>
      <div className="essay-nav">
        <Link href="/blog">
          <ArrowLeft size={15} />
          Back to writing
        </Link>
        <CopyButton label="Copy article link" />
      </div>
      <article>
        <header className="essay-header">
          <h1>{routingPost.title}</h1>
          <div className="essay-meta mono">
            <span>By Mahek Ara</span>
            <span>{routingPost.date}</span>
            <span>{routingPost.readTime}</span>
          </div>
        </header>
        <div className="essay-layout">
          <aside className="essay-toc">
            <p className="mono">In this note</p>
            <nav aria-label="Article contents">
              {contents.map(([id, title], index) => (
                <a key={id} href={`#${id}`}>
                  <span>0{index + 1}</span>
                  {title}
                </a>
              ))}
            </nav>
          </aside>
          <div className="essay-body" id="essay-body">
            <p className="essay-lede">
              RouterFlow is a small FastAPI app: send it a prompt, and it
              chooses a local Ollama model. I built it to make that choice
              visible, rather than hiding everything behind one model call.
            </p>
            <Section id="the-problem">
              <p>
                Choosing a model sounds simple until you have to explain the
                choice. A short prompt isn&apos;t necessarily easy, and a long
                prompt doesn&apos;t always need a bigger model.
              </p>
              <p>
                This version takes a small step. It looks for keywords, picks a
                route, and returns the reason along with the response time.
              </p>
              <p>
                That gives me something to inspect. It doesn&apos;t tell me that
                the chosen model was the best one, or that the answer is good.
                Those are separate questions.
              </p>
            </Section>
            <RoutingDiagram />
            <aside
              className="implementation-note"
              aria-label="Current implementation"
            >
              <h2 className="mono">What RouterFlow does today</h2>
              <p>
                Right now, RouterFlow has three route labels but only two
                models: Qwen 2.5 1.5B and Llama 3.2 3B. Medium and large both
                use Llama. The diagrams show a broader design; response checking
                and escalation aren&apos;t implemented in this prototype.
              </p>
              <Link className="text-link" href="/projects#llm-router">
                Code and project notes <ArrowUpRight size={16} />
              </Link>
            </aside>
            <Section id="basic-idea" title="Before the model call">
              <p>
                The sketch below assumes you&apos;ve already assigned a
                complexity label. RouterFlow uses keyword rules for that step;
                this isn&apos;t a learned estimate of how hard a prompt is.
              </p>
              <p>The choice itself can be a few branches:</p>
              <CodeBlock
                code={`if complexity == "low":
    model = small_model

elif complexity == "medium":
    model = general_model

else:
    model = reasoning_model`}
              />
              <p>
                Most of the uncertainty sits in that complexity label. A short
                set of rules is easy to read, but it can still send a request to
                the wrong place.
              </p>
            </Section>
            <Section id="the-shift" title="Keep the choice separate">
              <p>
                RouterFlow keeps classification in router.py and the Ollama call
                in llm.py. That makes it easier to follow one question:
              </p>
              <blockquote>Which model should answer this request?</blockquote>
              <p>
                The API also returns a reason for the route and measures the
                model call. I can check which rule fired without digging through
                the rest of the request.
              </p>
              <p>
                That separation is useful, but it isn&apos;t an evaluation.
                Explaining a rule is different from showing that the rule makes
                good choices.
              </p>
            </Section>
            <Section id="routing-cost" title="Routing is not free">
              <p>
                Every routing step has to earn its place. Keyword checks are
                small, but a separate model-based classifier would add another
                call before the user gets an answer.
              </p>
              <p>
                No cost-saving claim here: RouterFlow&apos;s cost field is
                currently a fixed zero. It isn&apos;t a measurement, and latency
                alone doesn&apos;t tell me whether a route was worth taking.
              </p>
              <p>What I&apos;d want to compare is:</p>
              <CodeBlock
                language="The trade-off"
                code={`lowest reasonable cost
+
lowest acceptable latency
+
answer quality that still holds up`}
              />
              <p>
                Those measurements need to include mistakes and retries. A fast
                first answer doesn&apos;t help much if the user has to ask again
                or the system has to call a second model.
              </p>
            </Section>
            <Section id="escalation" title="After the first answer">
              <p>
                A possible next step would be to check an answer before
                accepting it. If it fails a task-specific check, the system
                could retry with another model.
              </p>
              <p>
                The hard part is deciding what counts as a failed answer. A
                structured-output task can have a clear schema check; an
                open-ended explanation needs a different evaluation. A model
                sounding confident isn&apos;t enough.
              </p>
              <RoutingDiagram escalation />
              <p>
                RouterFlow doesn&apos;t do this yet. I&apos;d want to test the
                checker before relying on it to trigger more inference calls.
              </p>
            </Section>
            <Section id="production" title="What I would measure">
              <p>
                Before using this beyond a local prototype, I&apos;d need a set
                of prompts with clear expectations. Then I could compare routing
                against simply calling each model and look at these together:
              </p>
              <ul className="metric-list">
                {[
                  "Routing accuracy",
                  "Average latency",
                  "Cost per request",
                  "Answer quality",
                  "Escalation rate",
                ].map((metric, index) => (
                  <li key={metric}>
                    <span>0{index + 1}</span>
                    {metric}
                  </li>
                ))}
              </ul>
              <p>
                Retries count too. If a small-model route often needs a second
                attempt, its total time and cost matter more than the first
                call&apos;s numbers.
              </p>
            </Section>
            <Section id="closing">
              <p>
                This version answers a narrow question: which keyword rule sent
                a request to which local model, and how long did that call take?
              </p>
              <p>The harder question is still open:</p>
              <p className="essay-conclusion">
                Did that choice lead to a better answer?
              </p>
            </Section>
            <div className="essay-bottom">
              <Link className="text-link" href="/projects#llm-router">
                RouterFlow notes <ArrowUpRight size={16} />
              </Link>
              <Link className="text-link" href="/blog">
                All writing <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
