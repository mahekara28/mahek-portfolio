import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects, sourceUrl } from "../lib/content";
import { ProjectArchive } from "../components/project-archive";

export const metadata: Metadata = {
  title: "Selected work",
  description: "Context Relay, Build, Buy or Borrow and Aura for LinkedIn: practical tools and interfaces with inspectable decisions and source code.",
};

const selected = [
  {
    id: "context-relay",
    cover: "Context\nRelay",
    summary: "Carry the useful context forward. A local CLI, interface and MCP integration for reviewing and handing off context between supported coding agents.",
    featureHref: "https://mahekara28.github.io/context-relay/",
    featureLabel: "Project website",
    notesHref: "/blog/context-relay",
    notesLabel: "Build notes",
  },
  {
    id: "build-buy-borrow",
    cover: "Build, Buy\nor Borrow",
    summary: "Make the assumptions visible. Compare staffing approaches against time, budget and capacity, using fictional scenarios.",
    featureHref: "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912/PORTFOLIO.md",
    featureLabel: "Case study",
    notesHref: "/blog/decision-assumptions",
    notesLabel: "Build notes",
  },
  {
    id: "aura-linkedin",
    cover: "",
    summary: "Make a familiar workspace feel personal. Four photographic LinkedIn themes, saved appearance controls and a studio for trying them on sample profiles.",
    featureHref: "/projects/aura-theme-collection.jpg",
    featureLabel: "View four themes",
    notesHref: "https://github.com/mahekara28/aura-linkedin/blob/0df430a24d1baeec08e091061afce3bc601bae5f/README.md",
    notesLabel: "Setup & controls",
  },
] as const;

export default function ProjectsPage() {
  return (
    <main id="main" className="md-paper-view" tabIndex={-1}>
      <p className="md-eyebrow">Selected work</p>
      <h1>A few things I’ve built.</h1>
      <p className="md-intro">Small, practical tools and interfaces with decisions you can inspect and code you can explore.</p>
      <div className="md-projects">
        {selected.map((item) => {
          const project = projects.find((entry) => entry.id === item.id)!;
          const aura = item.id === "aura-linkedin";
          return (
            <article className={`md-project${aura ? " md-project--aura" : ""}`} id={project.id} key={project.id}>
              {aura ? (
                <a className="md-project-cover md-project-cover--image" href={item.featureHref} target="_blank" rel="noreferrer" aria-label="Open full-size previews of all four Aura themes">
                  <Image src="/projects/aura-theme-collection.jpg" alt="Four sample LinkedIn profiles with pink, cosmic, motorsport and metallic themes." width={1400} height={1040} sizes="(max-width: 700px) 100vw, 420px" />
                </a>
              ) : (
                <div className="md-project-cover" aria-hidden="true"><span>{item.cover}</span></div>
              )}
              <div className="md-project-body">
                <p className="md-status">{project.category} · {project.status}</p>
                <h2>{project.title}</h2>
                <p>{item.summary}</p>
                <div className="md-project-links">
                  <a href={item.featureHref} target="_blank" rel="noreferrer">{item.featureLabel}</a>
                  <a href={project.github} target="_blank" rel="noreferrer">Source code</a>
                  {item.notesHref.startsWith("/") ? <Link href={item.notesHref}>{item.notesLabel}</Link> : <a href={item.notesHref} target="_blank" rel="noreferrer">{item.notesLabel}</a>}
                </div>
                <details className="md-project-details">
                  <summary>How it works & current limits</summary>
                  <p>{project.approach}</p><p>{project.boundary}</p>
                  <ul>{project.evidence.map((evidence) => <li key={evidence.path}><a href={sourceUrl(project, evidence.path)} target="_blank" rel="noreferrer">{evidence.label}</a></li>)}</ul>
                </details>
              </div>
            </article>
          );
        })}
      </div>
      <ProjectArchive>
        {projects.filter((project) => !selected.some((item) => item.id === project.id)).map((project) => (
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
