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
        <h1>
          Writing<span className="name-period">.</span>
        </h1>
        <p className="intro-deck">
          Notes from building, testing and trying again.
        </p>
      </header>
      <article className="writing-entry">
        <div className="writing-meta mono">
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
        <h2 id="repository-writing-title">In the repositories</h2>
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
      </section>
    </main>
  );
}
