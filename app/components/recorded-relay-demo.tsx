"use client";

import Image from "next/image";
import { useState } from "react";

export function RecordedRelayDemo() {
  const [playing, setPlaying] = useState(false);
  return <figure className="md-recorded-demo">
    <Image id="relay-recording" src={`/images/context-relay/${playing ? "workflow.gif" : "threads.png"}`} alt={playing
      ? "Recorded Relay workspace: review the seven-day retention correction, offer a Codex handoff and inspect the architecture."
      : "Relay's Threads view with the synthetic retention conversation and its source events."}
      width={1440} height={1120} unoptimized />
    <div className="md-demo-controls">
      <button type="button" aria-pressed={playing} aria-controls="relay-recording" onClick={() => setPlaying(value => !value)}>{playing ? "Stop demo" : "Play recorded demo"}</button>
      <a href="https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/README.md#why-context-relay">View in README</a>
    </div>
    <figcaption>Actual npm workspace, synthetic example data. The recording contains no model calls or task execution. Stop returns to the still image.</figcaption>
  </figure>;
}
