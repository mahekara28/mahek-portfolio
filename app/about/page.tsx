import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { links } from "../lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main id="main" className="page-main about-main">
      <header className="page-intro">
        <h1>
          A little about me<span className="name-period">.</span>
        </h1>
      </header>
      <div className="about-layout">
        <p className="about-hello">Hi, I&apos;m Mahek.</p>
        <div className="about-copy">
          <p className="about-lead">
            I like building a tool, figuring out where it breaks, and making it
            easier for the next person to use.
          </p>
          <p>
            I have a B.Tech background in Artificial Intelligence and experience
            with operational systems. My projects range from local AI apps and
            MCP tooling to working with the questions developers leave in GitHub
            issues.
          </p>
          <p>
            That&apos;s what draws me to both engineering and DevRel: the code,
            and the conversations that help make it better.
          </p>
          <div className="about-links">
            <Link className="text-link" href="/projects?focus=developer">
              Developer tools <ArrowUpRight size={16} />
            </Link>
            <a
              className="text-link"
              href={links.resume}
              target="_blank"
              rel="noreferrer"
            >
              Resume <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
