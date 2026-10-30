import type { Metadata } from "next";
import Link from "next/link";
import { notes, readingTime } from "../lib/writing";

export const metadata: Metadata = { title: "Writing", description: "Technical essays on the systems I build, starting with Context Relay and agent handoffs." };

export default function BlogPage() {
  return (
    <main id="main" className="md-paper-view" tabIndex={-1}>
      <p className="md-eyebrow">Engineering notes</p>
      <h1>Inside the systems I build.</h1>
      <p className="md-intro">The problem, the implementation, and the evidence behind each design decision.</p>
      <div className="md-posts">
        {notes.map((note, index) => (
          <Link className="md-post" href={`/blog/${note.slug}`} key={note.slug}>
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
            <span><strong>{note.title}</strong><span>{note.description}</span><span>{note.topic} · {readingTime(note)}</span></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
