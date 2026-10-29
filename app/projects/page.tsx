import type { Metadata } from "next";
import { ProjectBook } from "../components/project-book";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">
      <header className="page-intro projects-intro">
        <div><p className="page-kicker">Code & experiments</p><h1>
          Projects<span className="name-period">.</span>
        </h1></div>
        <p className="intro-deck">
          Local models, developer tools, and a few useful experiments. Here&apos;s the work, with the code behind it.
        </p>
      </header>
      <ProjectBook />
    </main>
  );
}
