import type { Metadata } from "next";
import { links } from "../lib/content";

export const metadata: Metadata = { title: "Say hello", description: "Get in touch with Mahek Ara about AI tools, operations and useful things to build." };

export default function ContactPage() {
  return (
    <main id="main" className="md-paper-view md-contact" tabIndex={-1}>
      <p className="md-eyebrow">A conversation starts somewhere</p>
      <h1>Let’s say hello.</h1>
      <p className="md-intro">Have a useful problem to work on, a question about a project, or something worth exploring together?</p>
      <a className="md-email" href={links.email}>mahekarabangi28@gmail.com</a>
      <nav className="md-contact-links" aria-label="Contact profiles">
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={links.x} target="_blank" rel="noreferrer">X / Twitter</a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
    </main>
  );
}
