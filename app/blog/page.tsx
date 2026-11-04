import type { Metadata } from "next";
import Link from "next/link";
import { notes, readingTime } from "../lib/writing";

export const metadata: Metadata = { title: "Writing", description: "Notes on agent infrastructure, performance, LLM context and developer tools." };

export default function BlogPage() {
  return (
    <main id="main" className="md-paper-view md-writing-view" tabIndex={-1}>
      <p className="md-eyebrow">Engineering notes</p>
      <h1>Things I’ve worked through.</h1>
      <p className="md-intro">What I tried, what needed another look, and the details I wanted to write down.</p>
      <div className="md-posts">
        {notes.map((note, index) => (
          <Link className="md-post" href={`/blog/${note.slug}`} key={note.slug}>
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
            <span className="md-post-content"><span className="md-post-meta">{note.topic} · {readingTime(note)}</span><strong>{note.title}</strong><span className="md-post-description">{note.description}</span><span className="md-post-read">Read the note</span></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
