"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { featuredProjects as projects } from "../lib/content";
import { traceLabels, traceStudies } from "../lib/trace-studies";
import { TraceField } from "./trace-field";

export function ProjectExplorer() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const project = projects[active];
  const trace = traceStudies[active];
  const labels = traceLabels(active);

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
    <section className="project-explorer" aria-label="Selected projects">
      <div className="explorer-heading">
        <span className="mono">A closer look / Six projects</span>
        <Link className="text-link" href="/projects">
          All projects <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <div className="explorer-tabs" role="tablist" aria-label="Projects">
        {projects.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            role="tab"
            id={`study-tab-${index}`}
            aria-selected={active === index}
            aria-controls="study-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <span className="mono">{item.number}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <div
        id="study-panel"
        role="tabpanel"
        aria-labelledby={`study-tab-${active}`}
        tabIndex={0}
        className="study-panel"
      >
        <div className="study-heading">
          <h2>{project.question}</h2>
          <span className="mono">{project.status} / Flow sketch</span>
        </div>
        <figure className="trace-study">
          <div className="field-surface">
            <TraceField study={active} />
            <span className="trace-operation mono">{trace.operation}</span>
            <div className="trace-labels">
              {labels.inputs.map((label) => (
                <span
                  key={label.text}
                  className="trace-input"
                  style={{
                    left: `${label.x * 100}%`,
                    top: `${label.y * 100}%`,
                  }}
                >
                  {label.text}
                </span>
              ))}
              {labels.outputs.map((label, index) => (
                <span
                  key={label.text}
                  className={`trace-output trace-group-${index}`}
                  style={{
                    left: `${label.x * 100}%`,
                    top: `${label.y * 100}%`,
                  }}
                >
                  {label.text}
                </span>
              ))}
            </div>
          </div>
          <figcaption className="study-summary">
            <p>{trace.note}</p>
            <div className="study-links">
              <Link className="text-link" href={`/projects#${project.id}`}>
                Project notes <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="text-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                Source <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
