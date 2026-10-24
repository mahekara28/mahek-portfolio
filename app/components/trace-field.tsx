"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "../theme-provider";
import { STRANDS, STEPS, tracePoint } from "../lib/trace-studies";

type Point = { x: number; y: number };
const pointsFor = (study: number) =>
  Array.from({ length: STRANDS }, (_, line) =>
    Array.from({ length: STEPS + 1 }, (_, step) =>
      tracePoint(study, line, step / STEPS),
    ),
  );

export function TraceField({ study = 0 }: { study?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const displayed = useRef<Point[][] | null>(null);
  const lastStudy = useRef(study);
  const { isDark } = useTheme();

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const destination = pointsFor(study);
    const from = displayed.current ?? destination;
    const changed = lastStudy.current !== study;
    lastStudy.current = study;
    let width = 0;
    let height = 0;
    let frame = 0;
    let start: number | undefined;
    let progress = changed && !reduced.matches && !document.hidden ? 0 : 1;
    const palette = isDark
      ? ["#f07861", "#a9bcaa", "#8aace2"]
      : ["#c34732", "#4c6659", "#597aa7"];

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current: Point[][] = [];
      for (let line = 0; line < STRANDS; line++) {
        current[line] = [];
        context.beginPath();
        context.strokeStyle = palette[Math.floor(line / 20)];
        context.globalAlpha = line % 20 === 10 ? 1 : 0.65;
        context.lineWidth = line % 20 === 10 ? 1.7 : 0.8;
        for (let step = 0; step <= STEPS; step++) {
          const a = from[line][step];
          const b = destination[line][step];
          const point = {
            x: a.x + (b.x - a.x) * eased,
            y: a.y + (b.y - a.y) * eased,
          };
          current[line].push(point);
          if (step === 0) context.moveTo(width * point.x, height * point.y);
          else context.lineTo(width * point.x, height * point.y);
        }
        context.stroke();
      }
      // A rapid selection continues from the visible shape instead of jumping back.
      displayed.current = current;
      context.globalAlpha = 1;
    }

    function tick(time: number) {
      start ??= time;
      progress = Math.min((time - start) / 540, 1);
      draw();
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (!element || !context) return;
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    if (progress < 1) frame = requestAnimationFrame(tick);
    const settle = () => {
      if (document.hidden || reduced.matches) {
        cancelAnimationFrame(frame);
        progress = 1;
        draw();
      }
    };
    document.addEventListener("visibilitychange", settle);
    reduced.addEventListener("change", settle);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", settle);
      reduced.removeEventListener("change", settle);
    };
  }, [study, isDark]);

  return <canvas ref={canvas} className="trace-canvas" aria-hidden="true" />;
}
