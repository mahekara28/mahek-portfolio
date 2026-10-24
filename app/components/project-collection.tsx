"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  focusAreas,
  isFocus,
  projects,
  reviewedOn,
  sourceUrl,
  type Focus,
} from "../lib/content";
import snapshot from "../lib/github-snapshot.json";

const shortDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

export function ProjectCollection() {
  const [filter, setFilter] = useState<Focus>("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  useEffect(() => {
    let frame = 0;
    function readLocation() {
      const url = new URL(window.location.href);
      const focus = url.searchParams.get("focus");
      const id = url.hash.slice(1);
      const linkedProject = projects.some((project) => project.id === id);
      setFilter(linkedProject ? "all" : isFocus(focus) ? focus : "all");
      if (linkedProject) {
        setExpanded((current) =>
          current.includes(id) ? current : [...current, id],
        );
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ block: "start" }),
        );
      }
    }
    readLocation();
    window.addEventListener("hashchange", readLocation);
    window.addEventListener("popstate", readLocation);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", readLocation);
      window.removeEventListener("popstate", readLocation);
    };
  }, []);

  function changeFilter(value: Focus) {
    setFilter(value);
    const url = new URL(window.location.href);
    url.hash = "";
    if (value === "all") url.searchParams.delete("focus");
    else url.searchParams.set("focus", value);
    window.history.pushState(null, "", url);
  }

  const visible = projects.filter(
    (project) => filter === "all" || project.focus.includes(filter),
  );
  return (
    <>
      <div className="collection-toolbar">
        <div className="filter-group" role="group" aria-label="Filter projects">
          {focusAreas.map(({ id, label }) => (
            <button
              key={id}
              aria-pressed={id === filter}
              onClick={() => changeFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="mono" aria-live="polite">
          {visible.length} projects
        </span>
      </div>
      <div className="project-list">
        {visible.map((project) => {
          const open = expanded.includes(project.id);
          const repo =
            snapshot.repositories[
              project.repo as keyof typeof snapshot.repositories
            ];
          return (
            <article className="project-study" key={project.id} id={project.id}>
              <div className="project-number mono">{project.number}</div>
              <div className="project-identity">
                <p className="mono">{project.category}</p>
                <h2>{project.title}</h2>
                <p className="project-question">{project.question}</p>
                <ul className="tech-list" aria-label="Technologies">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
              <div className="project-evidence">
                <span className="project-status mono">{project.status}</span>
                <p>{project.description}</p>
                <div className="project-actions">
                  <button
                    className="text-link"
                    aria-expanded={open}
                    aria-controls={`${project.id}-details`}
                    onClick={() =>
                      setExpanded((current) =>
                        open
                          ? current.filter((id) => id !== project.id)
                          : [...current, project.id],
                      )
                    }
                  >
                    {open ? "Hide details" : "Show details"}
                    <span
                      className={open ? "expand-mark expanded" : "expand-mark"}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <a
                    className="text-link"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source on GitHub{" "}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div
                className="project-detail"
                id={`${project.id}-details`}
                hidden={!open}
              >
                <div>
                  <h3 className="mono">Why I built it</h3>
                  <p>{project.detail}</p>
                </div>
                <div>
                  <h3 className="mono">How it works</h3>
                  <p>{project.approach}</p>
                </div>
                <div className="project-boundary">
                  <h3 className="mono">The limits</h3>
                  <p>{project.boundary}</p>
                </div>
                <div className="source-evidence">
                  <h3 className="mono">The code & notes</h3>
                  <ul>
                    {project.evidence.map((item) => (
                      <li key={item.path}>
                        <a
                          className="text-link"
                          href={sourceUrl(project, item.path)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.label}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="source-review">
                    Reviewed{" "}
                    <time dateTime={reviewedOn}>{shortDate(reviewedOn)}</time>{" "}
                    at{" "}
                    <a
                      href={`${project.github}/tree/${project.revision}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} reviewed source revision ${project.revision.slice(0, 7)}`}
                    >
                      <code>{project.revision.slice(0, 7)}</code>
                    </a>
                    .
                    {repo && (
                      <>
                        {" "}
                        Repository last pushed{" "}
                        <time dateTime={repo.pushedAt}>
                          {shortDate(repo.pushedAt)}
                        </time>
                        {repo.archived ? " (archived)" : ""}.
                      </>
                    )}
                  </p>
                  {project.id === "llm-router" && (
                    <Link className="text-link" href="/blog/llm-routing">
                      My note on routing <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
                {project.id === "build-buy-borrow" && open && (
                  <figure className="project-capture">
                    <a
                      href="/projects/build-buy-borrow.png"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open full-size Build, Buy or Borrow screenshot"
                    >
                      <Image
                        src="/projects/build-buy-borrow.png"
                        alt="Scenario studio comparing Build, Buy, Borrow and Blend, with a team plan and itemised costs."
                        width={1440}
                        height={1075}
                        sizes="(max-width: 760px) 85vw, 1000px"
                      />
                    </a>
                    <figcaption>
                      The scenario studio, using fictional people and example
                      costs. These aren&apos;t client results.
                    </figcaption>
                  </figure>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="collection-provenance">
        Source notes reviewed {shortDate(reviewedOn)}. GitHub metadata snapshot:{" "}
        <time dateTime={snapshot.fetchedAt}>
          {shortDate(snapshot.fetchedAt)}
        </time>
        .
      </p>
    </>
  );
}
