import type { Metadata } from "next";
import Link from "next/link";
import { projects, sourceUrl } from "../lib/content";
import { ProjectArchive } from "../components/project-archive";

export const metadata: Metadata = { title: "Selected work", description: "Context Relay and Build, Buy or Borrow: practical tools with inspectable decisions and source code." };
const selected = ["context-relay", "build-buy-borrow"].map(id => projects.find(project => project.id === id)!);

export default function ProjectsPage() {
  return (
    <main id="main" className="md-paper-view" tabIndex={-1}>
      <p className="md-eyebrow">Selected work</p>
      <h1>A few things I’ve built.</h1>
      <p className="md-intro">Small, practical tools with decisions you can inspect and code you can explore.</p>
      <div className="md-projects">
        {selected.map((project, index) => (
          <article className="md-project" id={project.id} key={project.id}>
            <div className="md-project-cover" aria-hidden="true"><span>{index === 0 ? <>Context<br />Relay</> : <>Build, Buy<br />or Borrow</>}</span></div>
            <p className="md-status">{project.category} · {project.status}</p>
            <h2>{project.title}</h2>
            <p>{index === 0 ? "Carry the useful context forward. A local CLI, interface and MCP integration for reviewing and handing off context between supported coding agents." : "Make the assumptions visible. Compare staffing approaches against time, budget and capacity, using fictional scenarios."}</p>
            <div className="md-project-links">
              <a href={index === 0 ? "https://mahekara28.github.io/context-relay/" : sourceUrl(project, "PORTFOLIO.md")} target="_blank" rel="noreferrer">{index === 0 ? "Project website" : "Case study"}</a>
              <a href={project.github} target="_blank" rel="noreferrer">Source code</a>
              <Link href={index === 0 ? "/blog/context-relay" : "/blog/decision-assumptions"}>Build notes</Link>
            </div>
            <details className="md-project-details">
              <summary>How it works & current limits</summary>
              <p>{project.approach}</p><p>{project.boundary}</p>
              <ul>{project.evidence.map(item => <li key={item.path}><a href={sourceUrl(project, item.path)} target="_blank" rel="noreferrer">{item.label}</a></li>)}</ul>
            </details>
          </article>
        ))}
      </div>
      <ProjectArchive>
        {projects.filter(project => !selected.includes(project)).map(project => (
          <article id={project.id} key={project.id}>
            <h3>{project.title}</h3><p>{project.status} · {project.category}</p>
            <p>{project.description}</p><p>{project.boundary}</p>
            <div className="md-project-links">
              <a href={project.github} target="_blank" rel="noreferrer">Source code</a>
              <a href={sourceUrl(project, project.evidence[0].path)} target="_blank" rel="noreferrer">Implementation</a>
            </div>
          </article>
        ))}
      </ProjectArchive>
    </main>
  );
}
