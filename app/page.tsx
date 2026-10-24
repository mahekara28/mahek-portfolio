import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectExplorer } from "./components/project-explorer";
import { routingPost } from "./lib/content";

export default function Home() {
  return (
    <main id="main" className="home-main">
      <section className="introduction">
        <div className="intro-name">
          <p className="mono eyebrow">AI tools / Developer experience</p>
          <h1>
            Mahek Ara<span className="name-period">.</span>
          </h1>
        </div>
        <div className="intro-thought">
          <p>
            I build AI tools in Python, from a local model router to checks
            around agent actions.{" "}
            <span>
              I write about the decisions, and the parts that still need work.
            </span>
          </p>
        </div>
      </section>
      <ProjectExplorer />
      <section className="home-notes" aria-label="Writing and background">
        <div className="note-label mono">
          <span>From my notes</span>
          <span>01 / Writing</span>
        </div>
        <Link className="featured-note" href={routingPost.href}>
          <span className="mono">
            {routingPost.date} / {routingPost.readTime}
          </span>
          <h2>
            Why I built an LLM router.
            <br />
            <em>And what it actually does.</em>
          </h2>
          <span className="text-link">
            Read the note <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </Link>
        <div className="personal-note">
          <span className="mono">A little context</span>
          <p>
            Narrative Gap MCP looks at GitHub activity for clues about docs and
            onboarding. That side of building interests me too: helping
            developers get unstuck, then using what they ask to improve the
            tool.
          </p>
          <Link className="text-link" href="/about">
            More about me <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="text-link" href="/projects?focus=developer">
            Tools for developers <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
