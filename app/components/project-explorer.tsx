"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { featuredProjects as projects, sourceUrl } from "../lib/content";
import {
  connectionPath,
  workConnections,
  workTopics,
} from "../lib/work-connections";

export function ProjectExplorer({ introduction }: { introduction: ReactNode }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = workConnections[active];
  const project = projects[active];

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % projects.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + projects.length - 1) % projects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = projects.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="personal-work">
      <div className="intro-map">
        {introduction}
        <figure className="connection-map" aria-labelledby="map-title">
          <div className="map-heading">
            <h2 id="map-title">How the work connects</h2>
            <span className="map-hint">Pick a project</span>
          </div>
          <div className="map-surface">
            <svg
              className="connection-lines"
              viewBox="0 0 600 340"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {workConnections.flatMap((item) =>
                item.topics.map((id) => {
                  const topic = workTopics.find((entry) => entry.id === id)!;
                  return (
                    <path
                      className="connection-base"
                      key={item.projectId + id}
                      d={connectionPath(item, topic)}
                    />
                  );
                }),
              )}
              <g key={selected.projectId} className="connection-selection">
                {selected.topics.map((id) => {
                  const topic = workTopics.find((entry) => entry.id === id)!;
                  return (
                    <path
                      key={id}
                      className="connection-active"
                      pathLength="1"
                      d={connectionPath(selected, topic)}
                    />
                  );
                })}
              </g>
            </svg>
            {workTopics.map((topic) => (
              <span
                key={topic.id}
                className="map-topic"
                data-connected={selected.topics.includes(topic.id)}
                style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
              >
                <i aria-hidden="true" />
                <span>{topic.label}</span>
              </span>
            ))}
            {projects.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="map-project"
                style={{
                  left: `${workConnections[index].x}%`,
                  top: `${workConnections[index].y}%`,
                }}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                aria-label={`Show connections for ${item.title}`}
                aria-pressed={active === index}
                aria-controls="connection-note"
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onKeyDown={(event) => move(event, index)}
              >
                <span className="map-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
          <figcaption className="connection-caption" id="connection-note">
            <p aria-live="polite" aria-atomic="true">
              <span className="sr-only">{project.title}. </span>
              {selected.note}
            </p>
            <a
              className="text-link"
              href={sourceUrl(project, selected.sourcePath)}
              target="_blank"
              rel="noreferrer"
            >
              {selected.sourceLabel}{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </figcaption>
        </figure>
      </div>

      <section className="featured-work" aria-labelledby="selected-title">
        <div className="section-heading">
          <h2 id="selected-title">A few projects</h2>
          <Link className="text-link" href="/projects">
            All projects <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ol className="featured-projects">
          {projects.map((item, index) => (
            <li key={item.id} data-active={active === index}>
              <div className="featured-meta">
                <span
                  className="project-index"
                  data-active={active === index}
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <span>{item.category}</span>
              </div>
              <h3>
                <Link
                  href={`/projects#${item.id}`}
                  onFocus={() => setActive(index)}
                >
                  {item.title}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </h3>
              <p>{item.description}</p>
              <a
                className="project-repo"
                href={item.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.title} on GitHub`}
              >
                GitHub <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
