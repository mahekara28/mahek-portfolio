"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowRight, ArrowUpRight, Plus, RotateCcw, X } from "lucide-react";
import {
  assessConsumers,
  baseline,
  consumers,
  contractWithRequirement,
  impactSource,
} from "../lib/smallest-change";
import styles from "./smallest-change.module.css";

// These offsets compose the silhouette; they do not encode severity or traffic.
const sheets = [
  { left: "8%", width: "80%", hinge: "17.5%", tilt: "-2.2deg" },
  { left: "0%", width: "100%", hinge: "22%", tilt: "-1.5deg" },
  { left: "11%", width: "79%", hinge: "13.92%", tilt: "0deg" },
  { left: "4%", width: "91%", hinge: "19.78%", tilt: "-1.9deg" },
];

export function SmallestChange() {
  const [required, setRequired] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showMethod, setShowMethod] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const methodButton = useRef<HTMLButtonElement>(null);
  const review = assessConsumers(
    baseline,
    contractWithRequirement(required),
    consumers,
  );
  const flagged = review.filter((item) => item.status === "review").length;
  const inspected = review.find((item) => item.id === selected);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown") next = (index + 1) % review.length;
    else if (event.key === "ArrowUp")
      next = (index + review.length - 1) % review.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = review.length - 1;
    else return;
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  function dismiss() {
    if (showMethod) {
      setShowMethod(false);
      methodButton.current?.focus();
    } else if (selected) {
      buttons.current[
        review.findIndex((item) => item.id === selected)
      ]?.focus();
      setSelected(null);
    }
  }

  return (
    <section
      className={styles.experiment}
      aria-labelledby="change-title"
      data-testid="smallest-change"
      data-required={required}
      onKeyDown={(event) => {
        if (event.key === "Escape") dismiss();
      }}
    >
      <header className={styles.experimentHeading}>
        <h2 id="change-title">The smallest change.</h2>
        <span>From my MCP Impact project</span>
      </header>

      <div className={styles.contract}>
        <p className={styles.tool}>search_accounts</p>
        <div className={styles.contractLine}>
          <p>
            <code>lifecycle_stage</code> is{" "}
            <strong>{required ? "required" : "optional"}</strong>
          </p>
          <button
            type="button"
            className={styles.changeButton}
            onClick={() => setRequired((value) => !value)}
            aria-describedby="change-explanation"
            aria-controls="impact-sheets impact-result"
          >
            {required ? "Make optional" : "Make required"}
            {required ? (
              <RotateCcw size={15} aria-hidden="true" />
            ) : (
              <ArrowRight size={16} aria-hidden="true" />
            )}
          </button>
        </div>
        <p id="change-explanation" className={styles.contractHint}>
          {required
            ? "Every call now needs to supply this account filter."
            : "An account filter callers can currently leave out."}
        </p>
      </div>

      <div
        id="impact-sheets"
        className={styles.surface}
        role="group"
        aria-label="Inspect the four demo consumers"
      >
        <span className={styles.seam} aria-hidden="true" />
        {review.map((item, index) => (
          <button
            type="button"
            key={item.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            className={styles.sheet}
            style={
              {
                "--sheet-left": sheets[index].left,
                "--sheet-width": sheets[index].width,
                "--hinge": sheets[index].hinge,
                "--tilt": sheets[index].tilt,
              } as CSSProperties
            }
            data-consumer={item.id}
            data-status={item.status}
            aria-expanded={selected === item.id && !showMethod}
            aria-controls="impact-note"
            aria-label={`${item.name}: ${item.status === "review" ? "potentially affected" : "not flagged"}. Inspect references`}
            onClick={() => {
              setShowMethod(false);
              setSelected(selected === item.id ? null : item.id);
            }}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className={styles.underside} aria-hidden="true" />
            <span className={styles.face}>
              <span className={styles.sheetIndex} aria-hidden="true">
                0{index + 1}
              </span>
              <span className={styles.sheetText}>
                <span className={styles.sheetCategory}>{item.category}</span>
                <span className={styles.sheetName}>{item.name}</span>
              </span>
              <span className={styles.sheetStatus}>
                {item.status === "review" ? "Review" : "Not flagged"}
              </span>
              <Plus className={styles.sheetPlus} size={14} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      <div className={styles.result} id="impact-result">
        <p aria-live="polite" aria-atomic="true">
          {required
            ? `${flagged} places to check.`
            : "One input. Four places that might depend on it."}
          <span> No consumers were executed.</span>
        </p>
      </div>

      <div
        id="impact-note"
        className={styles.note}
        data-open={Boolean(inspected || showMethod)}
      >
        {showMethod ? (
          <div className={styles.method}>
            <div className={styles.noteHeading}>
              <h3>What this actually checks</h3>
              <button
                type="button"
                className={styles.closeNote}
                onClick={dismiss}
                aria-label="Close explanation"
              >
                <X size={16} />
              </button>
            </div>
            <p>
              A local comparison of the old and new contract. An optional input
              becomes required; consumers whose <code>toolRefs</code> name that
              tool are flagged for review.
            </p>
            <p>
              The four names and paths come from MCP Impact&apos;s fictional
              demo inventory. They aren&apos;t files in this portfolio. This
              example isolates one change from that demo.
            </p>
            <p>
              References don&apos;t tell us which arguments a caller sends. A
              failure would need an actual failing call or test. An unflagged
              item is only outside this change&apos;s known references.
            </p>
            <a
              href={impactSource.url + "#L633"}
              target="_blank"
              rel="noreferrer"
            >
              Read the original check{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <span className={styles.sourceRevision}>
              Pinned source · {impactSource.revision.slice(0, 7)}
            </span>
          </div>
        ) : inspected ? (
          <div className={styles.evidence}>
            <div className={styles.noteHeading}>
              <h3>
                {inspected.status === "review"
                  ? "A reference, not a confirmed failure."
                  : required
                    ? "This one stays still."
                    : "Before the change."}
              </h3>
              <button
                type="button"
                className={styles.closeNote}
                onClick={dismiss}
                aria-label="Close explanation"
              >
                <X size={16} />
              </button>
            </div>
            <p>
              {inspected.status === "review" ? (
                <>
                  This inventory entry references{" "}
                  <code>{inspected.reasons[0].tool}</code>. Its new required
                  input is <code>{inspected.reasons[0].field}</code>; we
                  haven&apos;t checked whether this caller already sends it.
                </>
              ) : required ? (
                <>
                  It only references <code>create_success_brief</code>. That
                  tool&apos;s contract hasn&apos;t changed, so this check
                  doesn&apos;t flag it.
                </>
              ) : (
                <>
                  No input has changed yet, so there&apos;s nothing to flag.
                  This entry references{" "}
                  {inspected.toolRefs.map((tool, index) => (
                    <span key={tool}>
                      {index > 0 ? " and " : ""}
                      <code>{tool}</code>
                    </span>
                  ))}
                  .
                </>
              )}
            </p>
            <p className={styles.samplePath}>
              Demo path <code>{inspected.sourcePath}</code>
            </p>
          </div>
        ) : (
          <p className={styles.invitation}>
            {required
              ? "The open edges need a second look. Select a sheet to see why."
              : "Change the requirement, then select a sheet to follow the evidence."}
          </p>
        )}
      </div>

      <div className={styles.provenance}>
        <span>Local example · fictional demo data</span>
        <button
          ref={methodButton}
          type="button"
          onClick={() => {
            setSelected(null);
            setShowMethod((value) => !value);
          }}
          aria-expanded={showMethod}
          aria-controls="impact-note"
        >
          {showMethod ? "Close the explanation" : "How do you know?"}{" "}
          <Plus size={13} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
