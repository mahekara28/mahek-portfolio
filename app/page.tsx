import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectExplorer } from "./components/project-explorer";
import { links, routingPost } from "./lib/content";

export default function Home() {
  return (
    <main id="main" className="home-main">
      <section className="introduction" aria-labelledby="intro-title">
        <p className="hello">Hi, I&apos;m</p>
        <h1 id="intro-title">
          Mahek Ara<span className="name-period">.</span>
        </h1>
        <div className="intro-bottom">
          <p>
            I build AI tools, experiment with how they behave, and write about
            what I learn.
          </p>
          <Link className="text-link" href="/about">
            A little about me <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="intro-links">
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={14} />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={14} />
          </a>
          <a
            href={links.x}
            target="_blank"
            rel="noreferrer"
            aria-label="Mahek Ara on X"
          >
            X <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <ProjectExplorer />
      <section className="home-writing" aria-labelledby="home-writing-title">
        <div className="section-heading">
          <h2 id="home-writing-title">A few notes</h2>
          <Link className="text-link" href="/blog">
            All writing <ArrowUpRight size={15} />
          </Link>
        </div>
        <Link className="home-note" href={routingPost.href}>
          <span className="mono">{routingPost.date}</span>
          <h3>{routingPost.title}</h3>
          <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
