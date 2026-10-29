"use client";

import { useEffect, useRef, useState } from "react";
import { evidenceAt } from "../lib/evidence-study";
import styles from "./evidence-field.module.css";

const stops = ["The reply", "The receipt", "The result"];

export function EvidenceField() {
  const field = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const verdict = evidenceAt(step, "wrong-format");

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let current = 0;
    let remaining = 1400;
    let startedAt = 0;
    let visible = false;

    function pause() {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, remaining - (performance.now() - startedAt));
    }
    function play() {
      if (!visible || document.hidden || reduced.matches || current === 2 || timer !== undefined) return;
      startedAt = performance.now();
      timer = setTimeout(() => {
        timer = undefined;
        current += 1;
        setStep(current);
        remaining = 1600;
        play();
      }, remaining);
    }
    function settle() {
      pause();
      current = 2;
      setStep(2);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (visible) play(); else pause();
    }, { threshold: [0, 0.5] });
    if (field.current) observer.observe(field.current);
    const stillTimer = reduced.matches ? setTimeout(settle, 0) : undefined;
    const onMotion = () => { if (reduced.matches) settle(); else play(); };
    const onVisibility = () => { if (document.hidden) pause(); else play(); };
    reduced.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      pause();
      clearTimeout(stillTimer);
      observer.disconnect();
      reduced.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section ref={field} className={styles.field} data-testid="evidence-field" data-step={step} data-state={verdict.state} aria-label="Looking past an AI's success message">
      <header className={styles.heading}><p>Would I trust “done”?</p><span>A small experiment</span></header>
      <div className={styles.request}><span>The request</span><p>Export a CSV with <code>name</code> and <code>email</code>.</p></div>

      <div className={styles.stage} aria-hidden="true" data-state={verdict.state}>
        <span className={styles.caption}>The model’s answer never changes.</span>
        <div className={styles.word}>done<span>.</span></div>
        <div className={styles.scan} key={step} />
        <div className={styles.annotation} key={`note-${step}`}>
          <span className={styles.annotationRule} />
          <span>{step === 0 ? "said ≠ verified" : step === 1 ? "{ ok: true } ≠ correct" : verdict.state === "checked" ? "checked against the request" : "the file tells a different story"}</span>
        </div>
        <span className={styles.registration}>0{step + 1} / 03</span>
      </div>

      <ol className={styles.progress} aria-label="The example unfolds automatically">
        {stops.map((stop, i) => <li key={stop} data-reached={step >= i} aria-current={step === i ? "step" : undefined}>{stop}</li>)}
      </ol>

      <div className={styles.verdict}>
        <span className={styles.verdictMark} aria-hidden="true">{verdict.state === "checked" ? "✓" : verdict.state === "mismatch" ? "↳" : "·"}</span>
        <div><h2>{verdict.title}</h2><p>{verdict.detail}</p></div>
      </div>
      <p className={styles.note}>I care about what an AI actually did, not just what it says. This example checks a local file; no model is running.</p>
    </section>
  );
}
