import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "../../components/article-tools";
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
      <article>
        <p className="md-eyebrow">{note.topic}</p>
        <h1>{note.title}</h1>
        <div className="md-article-meta">
          <span>By Mahek Ara</span>
          <time dateTime={note.date}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(note.date))}</time>
          <span>{readingTime(note)}</span>
        </div>
        <div className="md-article-body">
          {note.sections.map((section, index) => (
            <section key={section.title ?? index}>
              {section.title && <h2>{section.title}</h2>}
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
              {section.example && <figure className="md-article-example"><figcaption>{section.example.label}</figcaption><pre>{section.example.text}</pre></figure>}
            </section>
          ))}
          <section className="md-sources" aria-labelledby="sources-title">
            <h2 id="sources-title">Sources & further reading</h2>
            <ul>{note.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
          </section>
        </div>
      </article>
    </main>
  );
}
