import type { Metadata } from "next";
import Link from "next/link";
import { routingPost } from "../lib/content";
import { notes, readingTime } from "../lib/writing";

export const metadata: Metadata = { title: "Writing", description: "Notes on context, AI inference, decision systems and verifying the things we build." };

export default function BlogPage() {
  return (
    <main id="main" className="md-paper-view" tabIndex={-1}>
      <p className="md-eyebrow">From the notebook</p>
      <h1>Things worth figuring out.</h1>
      <p className="md-intro">Notes on the systems I build, the choices behind them, and the questions that stay with me.</p>
      <div className="md-posts">
        {notes.map((note, index) => (
          <Link className="md-post" href={`/blog/${note.slug}`} key={note.slug}>
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
            <span><strong>{note.title}</strong><span>{note.topic} · {readingTime(note)}</span></span>
          </Link>
        ))}
      </div>
      <section className="md-earlier" aria-labelledby="earlier-notes">
        <h2 id="earlier-notes">An earlier note</h2>
        <Link className="text-link" href={routingPost.href}>{routingPost.title}</Link>
      </section>
    </main>
  );
}
