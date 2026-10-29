import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EvidenceField } from "./components/evidence-field";
import { links } from "./lib/content";

export default function Home() {
  return (
    <main id="main" className="home-main">
      <header className="home-introduction" data-testid="home-introduction">
        <p className="greeting">Hi, I&apos;m</p>
        <h1>Mahek Ara.</h1>
        <p className="home-lead">Curious about how intelligent systems work, and how people make sense of them.</p>
        <p>AI, LLMs and developer tools keep pulling me in. I like taking an idea apart, trying it in code, and finding out where it stops behaving the way I expected.</p>
        <p>I&apos;m just as interested in the people around the technology: good docs, useful conversations, and communities where it&apos;s easy to ask questions and share what you learn.</p>
        <div className="intro-pages">
          <Link href="/projects">See my projects <ArrowUpRight size={15} aria-hidden="true" /></Link>
          <Link href="/blog">Read my notes <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="intro-social">
          {([['GitHub', links.github], ['LinkedIn', links.linkedin], ['X', links.x]] as const).map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={12} aria-hidden="true" /></a>)}
        </div>
      </header>
      <EvidenceField />
    </main>
  );
}
