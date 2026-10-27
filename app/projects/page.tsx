import type { Metadata } from "next";
import { ProjectCollection } from "../components/project-collection";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">
      <header className="page-intro">
        <h1>
          Projects<span className="name-period">.</span>
        </h1>
        <p className="intro-deck">
          Local apps, developer tools, and a few experiments.
        </p>
      </header>
      <ProjectCollection />
    </main>
  );
}
