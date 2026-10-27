"use client";

import { RotateCcw, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  decideSketch,
  inspectStage,
  sketchCases,
  sketchEdges,
  sketchPath,
  sketchPoints,
  sketchStages,
  type CaseId,
  type PointId,
  type StageId,
} from "../lib/decision-sketch";
import styles from "./decision-world.module.css";

function position(id: PointId): CSSProperties {
  const desktop = sketchPoints.desktop[id],
    mobile = sketchPoints.mobile[id];
  return {
    "--x": `${desktop.x}%`,
    "--y": `${desktop.y}%`,
    "--mx": `${mobile.x}%`,
    "--my": `${mobile.y}%`,
  } as CSSProperties;
}

function WorldDrawing({
  caseId,
  inspected,
  run,
  mobile = false,
}: {
  caseId: CaseId;
  inspected: StageId;
  run: number;
  mobile?: boolean;
}) {
  const example = sketchCases.find((item) => item.id === caseId)!;
  const decision = decideSketch(example);
  const points = sketchPoints[mobile ? "mobile" : "desktop"];
  const width = mobile ? 360 : 1000,
    height = mobile ? 500 : 430;
  const mainPath = sketchEdges
    .filter(
      (edge) =>
        decision.edges.includes(edge.id) && edge.id !== "context-boundary",
    )
    .map((edge) => sketchPath(edge, mobile))
    .join(" ");
  const boundaryPath = sketchPath(
    sketchEdges.find((edge) => edge.id === "context-boundary")!,
    mobile,
  );

  return (
    <svg
      className={mobile ? styles.mobileDrawing : styles.desktopDrawing}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {sketchEdges.map((edge) => {
        const active = decision.edges.includes(edge.id);
        return (
          <g
            key={edge.id}
            data-edge={edge.id}
            data-active={active}
            data-near={edge.from === inspected || edge.to === inspected}
            className={`${styles.channel} ${edge.id === "route-ask" ? styles.caution : edge.id === "context-boundary" ? styles.rejected : ""}`}
          >
            {Array.from({ length: mobile ? 7 : 11 }, (_, index) => {
              const strand = index - (mobile ? 3 : 5);
              return (
                <path
                  key={index}
                  d={sketchPath(edge, mobile, strand)}
                  className={strand === 0 ? styles.spine : styles.filament}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        );
      })}
      {(["context", "route", "check"] as const).map((id) => {
        const point = points[id];
        return (
          <g
            key={id}
            className={styles.aperture}
            data-selected={inspected === id}
            data-muted={id === "check" && !example.hasLog}
            transform={`translate(${(point.x * width) / 100} ${(point.y * height) / 100}) rotate(${mobile ? 24 : -24})`}
          >
            <ellipse rx={mobile ? 23 : 26} ry={mobile ? 34 : 48} />
            <ellipse rx={mobile ? 17 : 19} ry={mobile ? 28 : 40} />
          </g>
        );
      })}
      {(["request", "answer", "ask", "boundary"] as const).map((id) => {
        const point = points[id];
        const active =
          id === "request" ||
          (id === "answer" && example.hasLog) ||
          (id === "ask" && !example.hasLog) ||
          (id === "boundary" && example.quotedDirective);
        return (
          <circle
            key={id}
            cx={(point.x * width) / 100}
            cy={(point.y * height) / 100}
            r={id === "request" ? 3 : 5}
            data-active={active}
            className={`${styles.terminal} ${id === "ask" ? styles.caution : id === "boundary" ? styles.rejected : ""}`}
          />
        );
      })}
      <g key={`${caseId}-${run}`} className={styles.signalRun}>
        <path
          className={`${styles.signal} ${!example.hasLog ? styles.caution : ""}`}
          d={mainPath}
          pathLength="1000"
        />
        {example.quotedDirective && (
          <path
            className={`${styles.signal} ${styles.rejected} ${styles.rejectedSignal}`}
            d={boundaryPath}
            pathLength="1000"
          />
        )}
      </g>
    </svg>
  );
}

export function DecisionWorld() {
  const [caseId, setCaseId] = useState<CaseId>("context");
  const [inspected, setInspected] = useState<StageId>("context");
  const [run, setRun] = useState(0);
  const caseButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const nodeButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const example = sketchCases.find((item) => item.id === caseId)!;
  const decision = decideSketch(example);
  const insight = inspectStage(inspected, example);

  function chooseCase(id: CaseId) {
    setCaseId(id);
    setInspected(
      id === "injected" ? "boundary" : id === "context" ? "context" : "route",
    );
    setRun((value) => value + 1);
  }
  function move(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    kind: "case" | "node",
  ) {
    const count = kind === "case" ? sketchCases.length : sketchStages.length;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + count - 1) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    if (kind === "case") {
      chooseCase(sketchCases[next].id);
      caseButtons.current[next]?.focus();
    } else {
      setInspected(sketchStages[next].id);
      nodeButtons.current[next]?.focus();
    }
  }

  return (
    <section
      className={styles.world}
      aria-labelledby="world-question"
      data-case={caseId}
      data-outcome={decision.outcome}
    >
      <div className={styles.toolbar}>
        <div className={styles.question}>
          <span>An interactive sketch</span>
          <h2 id="world-question">Why did this build fail?</h2>
        </div>
        <div
          className={styles.choices}
          role="group"
          aria-label="Change the context"
        >
          {sketchCases.map((item, index) => (
            <button
              key={item.id}
              type="button"
              ref={(node) => {
                caseButtons.current[index] = node;
              }}
              aria-pressed={caseId === item.id}
              onClick={() => chooseCase(item.id)}
              onKeyDown={(event) => move(event, index, "case")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.worldSurface} data-testid="decision-world">
        <WorldDrawing caseId={caseId} inspected={inspected} run={run} />
        <WorldDrawing caseId={caseId} inspected={inspected} run={run} mobile />
        <span
          className={`${styles.endpoint} ${styles.request}`}
          data-endpoint="request"
          style={position("request")}
        >
          Request
        </span>
        <span
          className={`${styles.endpoint} ${styles.answer}`}
          data-endpoint="answer"
          data-reached={decision.outcome === "explain"}
          style={position("answer")}
        >
          Explain
        </span>
        <span
          className={`${styles.endpoint} ${styles.ask}`}
          data-endpoint="ask"
          data-reached={decision.outcome === "ask"}
          style={position("ask")}
        >
          Ask first
        </span>
        {sketchStages.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            className={styles.node}
            style={position(stage.id)}
            data-stage={stage.id}
            data-selected={inspected === stage.id}
            data-reached={stage.id !== "check" || example.hasLog}
            aria-label={`Inspect ${stage.label}`}
            aria-pressed={inspected === stage.id}
            aria-controls="decision-insight"
            ref={(node) => {
              nodeButtons.current[index] = node;
            }}
            onFocus={() => setInspected(stage.id)}
            onClick={() => setInspected(stage.id)}
            onKeyDown={(event) => move(event, index, "node")}
          >
            <span className={styles.nodeLabel}>{stage.label}</span>
            <span className={styles.nodeDot} aria-hidden="true" />
          </button>
        ))}
        <span className={styles.sceneHint}>Select a decision point</span>
      </div>

      <div className={styles.readout}>
        <div
          className={styles.insight}
          id="decision-insight"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3>{insight.title}</h3>
          <p>{insight.text}</p>
          <code>{insight.excerpt}</code>
        </div>
        <div className={styles.outcome} data-kind={decision.outcome}>
          <span>Outcome</span>
          <p role="status" aria-live="polite">
            {decision.result}
          </p>
          <button
            type="button"
            className={styles.replay}
            onClick={() => setRun((value) => value + 1)}
            aria-label="Follow the path again"
          >
            <RotateCcw size={13} aria-hidden="true" /> Follow again
          </button>
        </div>
      </div>
      <div className={styles.worldFooter}>
        <p>Interactive sketch · predefined cases, no model calls.</p>
        <Link href="/projects">
          The things I build <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
