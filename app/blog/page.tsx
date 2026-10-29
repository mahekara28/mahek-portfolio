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
        <div><p className="page-kicker">Notes worth keeping</p><h1>
          Writing<span className="name-period">.</span>
        </h1></div>
        <p className="intro-deck">
          Some things need more than a quick explanation. This is where I give them a little room.
        </p>
      </header>
      <article className="writing-feature">
        <div className="writing-meta mono">
          <span className="writing-number" aria-label="Article 1">01</span>
          <span>{routingPost.date}</span>
          <span>{routingPost.readTime}</span>
        </div>
        <Link href={routingPost.href} className="writing-link">
          <h2>{routingPost.title}</h2>
          <p>{routingPost.description}</p>
          <span className="text-link">
            Read the note <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </Link>
      </article>
      <section
        className="repository-writing"
        aria-labelledby="repository-writing-title"
      >
        <header><h2 id="repository-writing-title">Alongside the code</h2><p>Setup guides, decisions, and notes on what the tests actually cover.</p></header>
        <div>
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
                <h3>{note.title}</h3>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
