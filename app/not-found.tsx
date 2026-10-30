import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="md-paper-view" tabIndex={-1}>
      <p className="md-eyebrow">A little detour</p>
      <h1>This page wandered off.</h1>
      <p className="md-intro">There isn’t a note at this address. The writing folder is a good place to start.</p>
      <Link className="text-link" href="/blog">Open the notebook</Link>
    </main>
  );
}
