import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  projects,
  repositoryNotes,
  routingPost,
  sourceUrl,
} from "../lib/content";

export const metadata: Metadata = { title: "Writing" };

export default function BlogPage() {
  return (
    <main id="main" className="page-main writing-main">
      <header className="page-intro">
        <p className="mono eyebrow">Writing / Notes & guides</p>
        <h1>
          Notes from the work<span className="name-period">.</span>
        </h1>
        <p className="intro-deck">
          Model-routing notes, Python setup guides and the details that
          don&apos;t fit in a README introduction.
        </p>
      </header>
      <article className="writing-entry">
        <div className="writing-meta mono">
          <span>01</span>
          <span>{routingPost.date}</span>
          <span>AI engineering</span>
          <span>{routingPost.readTime}</span>
        </div>
        <Link href={routingPost.href} className="writing-link">
          <h2>
            Why I built an LLM router.
            <em>And what it actually does.</em>
          </h2>
          <p>{routingPost.description}</p>
          <span className="text-link">
            Read the note <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </Link>
      </article>
      <section
        className="repository-writing"
        aria-labelledby="repository-writing-title"
      >
        <div className="repository-writing-heading">
          <h2 id="repository-writing-title">Alongside the code</h2>
          <p>
            How to run things, what the tests cover, and what they don&apos;t.
          </p>
        </div>
        {repositoryNotes.map((note) => {
          const project = projects.find((item) => item.id === note.project)!;
          return (
            <a
              className="repository-note"
              key={note.title}
              href={sourceUrl(project, note.path)}
              target="_blank"
              rel="noreferrer"
            >
              <span className="mono">{note.kind}</span>
              <div>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          );
        })}
      </section>
    </main>
  );
}
