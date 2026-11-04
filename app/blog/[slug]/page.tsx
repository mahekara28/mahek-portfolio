import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopyButton } from "../../components/article-tools";
import { ArticleDiagram } from "../../components/article-diagram";
import { ArticleContents } from "../../components/article-contents";
import { RecordedRelayDemo } from "../../components/recorded-relay-demo";
import { AgentLatencyAnimation } from "../../components/agent-latency-animation";
import { notes, readingTime } from "../../lib/writing";

export const dynamicParams = false;
export function generateStaticParams() { return notes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find(note => note.slug === slug);
  if (!note) return {};
  return {
    title: note.title, description: note.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: note.title, description: note.description, type: "article", publishedTime: note.date, authors: ["Mahek Ara"] },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find(note => note.slug === slug);
  if (!note) notFound();
  return (
    <main id="main" className="md-paper-view md-article" tabIndex={-1}>
      <nav className="md-article-nav" aria-label="Article navigation">
        <Link href="/blog">Back to writing</Link>
        <CopyButton label="Copy article link" />
      </nav>
      <article className="md-article-layout">
        <header className="md-article-header">
          <p className="md-eyebrow">{note.topic}</p>
          <h1>{note.title}</h1>
          <p className="md-article-deck">{note.description}</p>
          <div className="md-article-meta">
            <span>By Mahek Ara</span>
            {note.date && <time dateTime={note.date}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(note.date))}</time>}
            <span>{readingTime(note)}</span>
          </div>
        </header>
        <ArticleContents sections={[...note.sections.map(({ id, label }) => ({ id, label })), { id: "sources", label: "Sources" }]} />
        <div className="md-article-body">
          {note.sections.map(section => (
            <section key={section.id} id={section.id} tabIndex={-1}>
              {section.title && <h2>{section.title}</h2>}
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.media === "architecture" && <figure className="md-readme-architecture">
                <picture>
                  <source media="(max-width: 700px)" srcSet="/images/context-relay/architecture-mobile.svg" width={640} height={1110} />
                  <Image src="/images/context-relay/architecture.svg" width={1200} height={730} unoptimized alt="README architecture: native capture and MCP connect Claude Code, Codex, OpenCode and Goose to one local service, with SQLite storage and optional reviewed Nebius proposals." />
                </picture>
                <figcaption>The architecture from the Context Relay README. Native capture and MCP share the service; optional model proposals return to review.</figcaption>
              </figure>}
              {section.media === "demo" && <RecordedRelayDemo />}
              {section.media === "agent-latency" && <AgentLatencyAnimation />}
              {section.media === "agent-cloud-workload" && <figure className="md-readme-architecture">
                <a href="/images/agent-cloud-workload/architecture.png" target="_blank" rel="noreferrer" aria-label="Open full-size architecture illustration">
                  <Image src="/images/agent-cloud-workload/architecture.png" width={3000} height={1920} sizes="(max-width: 700px) 90vw, 850px" alt="The application handles identity and approvals. An agent harness coordinates the model API, sandbox and external services, while durable storage holds task progress and saved reports. Tracing, cost limits and cancellation apply across the workflow." />
                </a>
                <figcaption>A conceptual architecture for the report agent. The boxes represent responsibilities, not individual servers. Working files need an explicit path into durable storage. <a href="/images/agent-cloud-workload/architecture.png" target="_blank" rel="noreferrer">View full-size diagram</a>.</figcaption>
              </figure>}
              {section.paragraphsAfterMedia?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.diagram && <ArticleDiagram id={section.diagram} />}
              {section.example && <figure className="md-article-example"><figcaption><span>{section.example.label}</span><CopyButton text={section.example.text} /></figcaption><pre>{section.example.text}</pre></figure>}
              {section.references && <p className="md-section-references">{section.references.map(source => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.title}</a>)}</p>}
            </section>
          ))}
          <section className="md-sources" id="sources" tabIndex={-1} aria-labelledby="sources-title">
            <h2 id="sources-title">Sources & further reading</h2>
            <ul>{note.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
          </section>
        </div>
      </article>
    </main>
  );
}
