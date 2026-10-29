"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { evaluateDecision, type Conditions } from "../lib/decision-model";
import styles from "./decision-field.module.css";

export function DecisionField() {
  const id = useId().replace(/:/g, "");
  const [conditions, setConditions] = useState<Conditions>({ privateDocument: true, localAvailable: true });
  const [revision, setRevision] = useState(0);
  const [touched, setTouched] = useState(false);
  const decision = evaluateDecision(conditions);

  function change(key: keyof Conditions) {
    setConditions((current) => ({ ...current, [key]: !current[key] }));
    setRevision((current) => current + 1);
    setTouched(true);
  }

  return (
    <section className={styles.field} aria-label="A small experiment in AI decisions" data-testid="decision-field" data-selected={decision.selected}>
      <header className={styles.heading}>
        <p>What would I let the system do?</p>
        <span>A small thought experiment</span>
      </header>
      <div className={styles.premise}>
        <span>Summarise a document.</span>
        <div className={styles.conditions}>
          <button aria-pressed={conditions.privateDocument} aria-label="Keep the document private" onClick={() => change("privateDocument")}>
            <span>Document</span><strong>{conditions.privateDocument ? "Private" : "Shareable"}</strong><span aria-hidden="true">↔</span>
          </button>
          <button aria-pressed={conditions.localAvailable} aria-label="Local model available" onClick={() => change("localAvailable")}>
            <span>Local model</span><strong>{conditions.localAvailable ? "Ready" : "Offline"}</strong><span aria-hidden="true">↔</span>
          </button>
        </div>
      </div>

      <svg className={styles.drawing} viewBox="0 0 660 342" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Three possible actions; {decision.title}</title>
        <desc id={`${id}-desc`}>{decision.routes.map((route) => `${route.label}: ${route.reason}.`).join(" ")}</desc>
        <defs>
          {decision.routes.map((route, index) => {
            const x = 132 - index * 48, y = 16 + index * 108;
            return <clipPath key={route.id} id={`${id}-${route.id}`}><path d={`M ${x} ${y} H ${x + 416} L ${x + 492} ${y + 82} H ${x + 76} Z`} /></clipPath>;
          })}
        </defs>
        {decision.routes.map((route, index) => {
          const x = 132 - index * 48, y = 16 + index * 108;
          const chosen = decision.selected === route.id;
          return (
            <g key={route.id} className={`${styles.route} ${chosen ? styles.chosen : route.allowed ? styles.available : styles.blocked}`} data-route={route.id} data-allowed={route.allowed}>
              <path className={styles.surface} d={`M ${x} ${y} H ${x + 416} L ${x + 492} ${y + 82} H ${x + 76} Z`} />
              <g clipPath={`url(#${id}-${route.id})`} aria-hidden="true">
                {Array.from({ length: 10 }, (_, row) => <text key={row} x={x - 24 + (row % 3) * 17} y={y + 8 + row * 9} className={styles.microtype}>{`${route.trace} / ${route.trace} / ${route.trace}`}</text>)}
                <rect x={x + 17} y={y + 18} width="360" height="45" className={styles.typeClear} />
                {chosen && <rect key={revision} x={x - 120} y={y} width="90" height="82" className={styles.scan} />}
              </g>
              <text x={x + 38} y={y + 52} className={styles.routeTitle}>{route.label}</text>
              <text x={x - 24} y={y + 40} className={styles.number}>0{index + 1}</text>
              <path className={styles.edge} d={`M ${x + 76} ${y + 82} H ${x + 492}`} />
              {!route.allowed && <path className={styles.cut} d={`M ${x + 378} ${y + 12} L ${x + 421} ${y + 68} M ${x + 389} ${y + 12} L ${x + 432} ${y + 68}`} />}
              {chosen && <path className={styles.check} d={`M ${x + 379} ${y + 39} l 8 8 l 16 -18`} />}
              <text x={x + 76} y={y + 98} className={styles.reason}>{route.reason}</text>
            </g>
          );
        })}
      </svg>

      <div className={styles.result}>
        <span className={styles.resultMark} aria-hidden="true">↳</span>
        <div><h2>{decision.title}</h2><p>{decision.explanation}</p></div>
      </div>
      <p className="sr-only" role="status">{touched ? `${decision.title} ${decision.explanation}` : ""}</p>
      <details className={styles.note}>
        <summary>Why this is here <Plus size={13} aria-hidden="true" /></summary>
        <p>I&apos;m interested in what an AI system should do when the situation changes. A fallback is useful only if it still respects the rules. These checks run here in your browser; no document or model is connected.</p>
      </details>
    </section>
  );
}
