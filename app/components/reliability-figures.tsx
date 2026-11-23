"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArticleImage } from "../lib/writing";
import styles from "./reliability-figures.module.css";

const series = [
  { rate: 99, color: "#126454", dash: undefined },
  { rate: 98, color: "#a4472c", dash: "8 3" },
  { rate: 95, color: "#56557a", dash: "2 4" },
];
const x = (step: number) => 42 + (step - 1) * 504 / 99;
const probability = (rate: number, steps: number) => (rate / 100) ** steps;
const y = (chance: number) => 20 + 180 * (1 - chance);
const lines = series.map(s => ({
  ...s,
  points: Array.from({ length: 100 }, (_, i) => `${x(i + 1)},${y(probability(s.rate, i + 1))}`).join(" "),
}));

export function ReliabilityChart({ image }: { image: ArticleImage }) {
  const [steps, setSteps] = useState(100);
  return <figure className={styles.chart} aria-label={image.title}>
    <figcaption>How often do all the steps succeed?</figcaption>
    <label className={styles.control}>
      <span>Workflow length <strong>{steps} {steps === 1 ? "step" : "steps"}</strong></span>
      <input type="range" min="1" max="100" value={steps} aria-valuetext={`${steps} steps`}
        onChange={event => setSteps(Number(event.target.value))} />
    </label>
    <svg viewBox="0 0 560 230" aria-hidden="true">
      {[1, 0.5, 0].map(chance => <g key={chance}>
        <line x1="42" x2="546" y1={y(chance)} y2={y(chance)} stroke="#b8c2af" />
        <text x="36" y={y(chance) + 4} textAnchor="end">{chance * 100}%</text>
      </g>)}
      {[1, 25, 50, 75, 100].map(step => <text key={step} x={x(step)} y="223" textAnchor="middle">{step}</text>)}
      {lines.map(s => <polyline key={s.rate} points={s.points} fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={s.dash} />)}
      <line x1={x(steps)} x2={x(steps)} y1="18" y2="201" stroke="#405b54" strokeDasharray="3 4" />
      {series.map(s => <circle key={s.rate} cx={x(steps)} cy={y(probability(s.rate, steps))} r="4.5" fill={s.color} stroke="#fff" />)}
    </svg>
    <dl className={styles.results} aria-label={`Chance of completing all ${steps} steps`}>
      {series.map(s => <div key={s.rate} style={{ borderColor: s.color }}>
        <dt>{s.rate}% per step</dt><dd>{(100 * probability(s.rate, steps)).toFixed(1)}%</dd>
      </div>)}
    </dl>
    <small>Assumes independent steps and no recovery. <a href={image.src}>Open static chart</a></small>
  </figure>;
}

export function ReliabilityLoop({ image, animation }: { image: ArticleImage; animation: string }) {
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  function play() {
    setRun(value => value + 1);
    setPlaying(true);
  }
  return <figure className="md-readme-architecture">
    <a href={image.src} target="_blank" rel="noreferrer" aria-label="Open full-size reliability loop">
      <Image src={playing ? `${animation}?run=${run}` : image.src} unoptimized width={image.width}
        height={image.height} alt={playing ? "An invoice check in seven stages. Verification finds a mismatch, the system logs it and holds payment for human review." : image.alt} />
    </a>
    <figcaption className={styles.controls}>
      <button type="button" onClick={play}>{playing ? "Replay invoice check" : "Play invoice check"}</button>
      {playing && <button type="button" onClick={() => setPlaying(false)}>Show still</button>}
    </figcaption>
  </figure>;
}
