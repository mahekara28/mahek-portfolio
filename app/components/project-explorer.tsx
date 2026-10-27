"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ScanLine } from "lucide-react";
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

  function preview(index: number) {
    setActive(index);
    if (window.matchMedia("(max-width: 760px)").matches) {
      document.getElementById("study-panel")?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }

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
    <section className="project-explorer" aria-labelledby="selected-title">
      <div className="section-heading">
        <h2 id="selected-title">Selected projects</h2>
        <Link className="text-link" href="/projects">
          All projects <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="explorer-layout">
        <ul className="explorer-projects" aria-label="Selected projects">
          {projects.map((item, index) => (
            <li key={item.id} data-active={active === index}>
              <div>
                <h3>
                  <Link
                    href={`/projects#${item.id}`}
                    onFocus={() => setActive(index)}
                  >
                    {item.title}
                  </Link>
                </h3>
                <p>{item.description}</p>
              </div>
              <button
                className="preview-button icon-button"
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                aria-label={`Preview ${item.title}`}
                aria-pressed={active === index}
                aria-controls="study-panel"
                onClick={() => preview(index)}
                onKeyDown={(event) => move(event, index)}
              >
                <ScanLine size={19} aria-hidden="true" />
                <span className="preview-tip" aria-hidden="true">
                  Preview sketch
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div
          id="study-panel"
          role="region"
          aria-labelledby="sketch-title"
          tabIndex={0}
          className="study-panel"
        >
          <div className="study-heading">
            <span className="mono">{project.status}</span>
            <h3 id="sketch-title">{project.title}</h3>
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
            <figcaption className="mono">
              A flow sketch, not live data.
            </figcaption>
          </figure>
          <div className="study-links">
            <Link className="text-link" href={`/projects#${project.id}`}>
              Project notes <ArrowRight size={16} />
            </Link>
            <a
              className="text-link"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
