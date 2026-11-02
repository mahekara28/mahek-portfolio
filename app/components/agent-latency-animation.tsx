"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AgentLatencyAnimation() {
  const figure = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, () => true);
  const playing = visible && !paused && !reducedMotion;

  useEffect(() => {
    if (!figure.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="md-latency-figure" ref={figure}>
      <p className="md-architecture-hint">Swipe or scroll the illustration to see every part.</p>
      <div className="md-architecture-scroll" tabIndex={0} role="region" aria-label="Agent request illustration; scroll horizontally on small screens">
        <Image
          id="agent-latency-animation"
          src={`/images/agent-latency/architecture.${playing ? "gif" : "png"}`}
          width={1200} height={730} unoptimized
          alt="One sequential request takes twelve seconds: three seconds of model calls, eight seconds of tool calls, and one second of browser and application work. The agent exports recorded spans to an observability backend. These are illustrative timings."
        />
      </div>
      {!reducedMotion && <div className="md-demo-controls">
        <button type="button" aria-pressed={!paused} aria-controls="agent-latency-animation" onClick={() => setPaused(value => !value)}>
          {paused ? "Play animation" : "Stop animation"}
        </button>
      </div>}
      <figcaption>One request, twelve seconds. The highlighted path follows the active operation; the dotted path shows telemetry export. This example runs sequentially and delivers the answer after generation finishes.</figcaption>
    </figure>
  );
}
