"use client";

import { traceLabels, traceStudies } from "../lib/trace-studies";
import { TraceField } from "./trace-field";

export function ProjectSketch({ projectId }: { projectId: string }) {
  const index = traceStudies.findIndex(
    (study) => study.projectId === projectId,
  );
  if (index < 0) return null;
  const labels = traceLabels(index);
  const trace = traceStudies[index];
  return (
    <figure
      className="project-sketch"
      aria-label={`${trace.operation}: flow sketch`}
    >
      <div className="field-surface">
        <TraceField study={index} />
        <span className="trace-operation mono">{trace.operation}</span>
        <div className="trace-labels">
          {labels.inputs.map((label) => (
            <span
              key={label.text}
              className="trace-input"
              style={{ left: `${label.x * 100}%`, top: `${label.y * 100}%` }}
            >
              {label.text}
            </span>
          ))}
          {labels.outputs.map((label, group) => (
            <span
              key={label.text}
              className={`trace-output trace-group-${group}`}
              style={{ left: `${label.x * 100}%`, top: `${label.y * 100}%` }}
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>
      <figcaption>A flow sketch, not live data.</figcaption>
    </figure>
  );
}
