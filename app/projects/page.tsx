import type { Metadata } from "next";
import { ProjectCollection } from "../components/project-collection";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">
      <header className="page-intro">
        <p className="mono eyebrow">Projects / 01—09</p>
        <h1>
          Things I&apos;ve built<span className="name-period">.</span>
        </h1>
        <div className="page-intro-bottom">
          <p>
            I&apos;ve been working on how agents follow instructions, how tools
            change, and what developers need to get started. Here are the
            implementations, from a two-model router to an MCP contract checker,
            with notes on what works and what doesn&apos;t yet.
          </p>
          <span className="mono">AI / Developer tools / Operations</span>
        </div>
      </header>
      <ProjectCollection />
    </main>
  );
}
