import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { links } from "../lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main id="main" className="page-main about-main">
      <header className="page-intro">
        <p className="mono eyebrow">A bit about me</p>
        <h1>
          Hi, I&apos;m Mahek<span className="name-period">.</span>
        </h1>
      </header>
      <div className="about-layout">
        <div className="about-aside">
          <span className="mono">What connects the projects</span>
          <p>
            The model.
            <br />
            The system around it.
            <br />
            <em>The person using it.</em>
          </p>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            I&apos;m interested in AI beyond the model call: what the tool does
            next, where it fails, and how someone else gets it working.
          </p>
          <p>
            I have a B.Tech background in Artificial Intelligence and experience
            with operational systems. My projects bring those interests together
            through Python, AI applications, data and the day-to-day work around
            them.
          </p>
          <p>
            Context Relay checks whether an agent&apos;s latest instruction
            reaches the tool call and the saved result. RouterFlow lets me see
            which rule picked a model and how long the call took. Both are ways
            of looking more closely at what happens after a prompt goes in.
          </p>
          <p>
            I&apos;m also curious about the questions developers ask around a
            tool. Narrative Gap MCP uses GitHub issues and pull requests to help
            review docs and onboarding. Counts alone don&apos;t explain a
            community, but the conversations can tell you where to look. This is
            the part of DevRel that interests me.
          </p>
          <p>
            Build, Buy or Borrow and Merchant Ops Desk cover another part of
            that work: planning a team, reviewing a catalog, and keeping track
            of why a decision was made. They&apos;re local projects, not client
            deployments.
          </p>
          <p>
            Some are early experiments; others have more pieces in place. The
            code, setup notes and tests are linked throughout, including the
            bits that need more work.
          </p>
          <div className="about-links">
            <Link className="text-link" href="/projects?focus=developer">
              Tools for developers <ArrowRight size={17} />
            </Link>
            <a
              className="text-link"
              href={links.resume}
              target="_blank"
              rel="noreferrer"
            >
              Resume <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
      <section className="interest-lines" aria-labelledby="interest-title">
        <h2 id="interest-title" className="mono">
          What I&apos;m trying to figure out
        </h2>
        <p>
          <span>01</span>Did the agent use the latest instruction?
        </p>
        <p>
          <span>02</span>Which files depend on this tool contract?
        </p>
        <p>
          <span>03</span>Where does a developer get stuck on the first run?
        </p>
      </section>
    </main>
  );
}
