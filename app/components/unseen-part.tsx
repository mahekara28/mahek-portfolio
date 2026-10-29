"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import {
  band,
  clampPosition,
  field,
  glyphIds,
  glyphPath,
  observe,
} from "../lib/unseen-part";
import styles from "./unseen-part.module.css";

const paths = Object.fromEntries(glyphIds.map((id) => [id, glyphPath(id)]));

export function UnseenPart() {
  const [position, setPosition] = useState<number>(band.initial);
  const [previewing, setPreviewing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLButtonElement>(null);
  const frame = useRef<number | null>(null);
  const introduced = useRef(false);
  const controlled = useRef(false);
  const grab = useRef(false);
  const touch = useRef<{ x: number; y: number; id: number } | null>(null);
  const id = useId().replace(/:/g, "");
  const view = observe(position);
  const stop = useCallback(() => {
    controlled.current = true;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPreviewing(false);
  }, []);

  useEffect(() => {
    const element = fieldRef.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function start() {
      if (
        introduced.current ||
        controlled.current ||
        media.matches ||
        document.hidden
      )
        return;
      introduced.current = true;
      setPreviewing(true);
      const started = performance.now();
      function draw(now: number) {
        const progress = Math.min(1, (now - started) / 2600);
        setPosition(
          clampPosition(
            band.initial +
              Math.sin(progress * Math.PI) ** 2 * (350 - band.initial),
          ),
        );
        if (progress < 1) frame.current = requestAnimationFrame(draw);
        else {
          frame.current = null;
          setPreviewing(false);
        }
      }
      frame.current = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.55) start();
        else if (frame.current !== null) stop();
      },
      { threshold: [0, 0.55] },
    );
    const visibility = () => {
      if (document.hidden) stop();
    };
    const motion = () => {
      if (media.matches) stop();
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", motion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", motion);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [stop]);

  function move(clientY: number) {
    const bounds = fieldRef.current?.getBoundingClientRect();
    if (bounds)
      setPosition(
        clampPosition(((clientY - bounds.top) / bounds.height) * field.height),
      );
  }
  function begin(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    stop();
    grab.current = true;
    setDragging(true);
    sliderRef.current?.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    move(event.clientY);
  }
  function release() {
    grab.current = false;
    setDragging(false);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    const changes: Record<string, number> = {
      ArrowUp: -8,
      ArrowLeft: -8,
      ArrowDown: 8,
      ArrowRight: 8,
      PageUp: -40,
      PageDown: 40,
    };
    if (event.key === "Home" || event.key === "End" || event.key in changes) {
      event.preventDefault();
      stop();
      setPosition((current) =>
        clampPosition(
          event.key === "Home"
            ? band.min
            : event.key === "End"
              ? band.max
              : current + changes[event.key],
        ),
      );
    }
  }
  function close() {
    setExplaining(false);
    whyRef.current?.focus();
  }

  return (
    <section
      className={styles.observation}
      aria-labelledby="observation-title"
      data-testid="unseen-part"
      data-position={position}
      data-matches={view.matches.join("")}
      data-previewing={previewing}
      onKeyDown={(event) => {
        if (event.key === "Escape" && explaining) close();
      }}
    >
      <h2 id="observation-title" className="sr-only">
        The Unseen Part: what can you tell from this much?
      </h2>
      <div
        ref={fieldRef}
        className={styles.field}
        data-dragging={dragging}
        data-testid="observation-field"
        style={
          { "--band-y": `${(position / field.height) * 100}%` } as CSSProperties
        }
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            touch.current = {
              x: event.clientX,
              y: event.clientY,
              id: event.pointerId,
            };
            return;
          }
          begin(event);
        }}
        onPointerMove={(event) => {
          if (grab.current) move(event.clientY);
        }}
        onPointerUp={(event) => {
          if (
            event.pointerType === "touch" &&
            touch.current?.id === event.pointerId &&
            Math.hypot(
              event.clientX - touch.current.x,
              event.clientY - touch.current.y,
            ) < 10
          ) {
            stop();
            move(event.clientY);
            sliderRef.current?.focus({ preventScroll: true });
          }
          touch.current = null;
          release();
        }}
        onPointerCancel={() => {
          touch.current = null;
          release();
        }}
        onLostPointerCapture={release}
      >
        <svg
          viewBox={`0 0 ${field.width} ${field.height}`}
          className={styles.drawing}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={`${id}-view`}>
              <rect
                x="0"
                y={view.top}
                width={field.width}
                height={band.height}
              />
            </clipPath>
          </defs>
          {glyphIds.map((glyph) => (
            <g
              key={glyph}
              className={styles.hypothesis}
              data-glyph={glyph}
              data-match={view.matches.includes(glyph)}
            >
              <path
                d={paths[glyph]}
                fillRule="evenodd"
                className={styles.possibleFill}
              />
              <path
                d={paths[glyph]}
                fillRule="evenodd"
                pathLength="1"
                className={styles.possibleEdge}
              />
            </g>
          ))}
          <g clipPath={`url(#${id}-view)`} data-testid="observed-ink">
            <path d={paths.R} fillRule="evenodd" className={styles.observed} />
          </g>
          <path
            d={`M28 ${view.top}H432 M28 ${view.bottom}H432`}
            className={styles.viewEdges}
          />
          <path
            d={`M28 ${view.top + 6}V${view.top}H34 M426 ${view.bottom}H432V${view.bottom - 6}`}
            className={styles.viewCorners}
          />
        </svg>
        <div
          ref={sliderRef}
          className={styles.handle}
          role="slider"
          tabIndex={0}
          aria-label="Observation band"
          aria-orientation="vertical"
          aria-valuemin={band.min}
          aria-valuemax={band.max}
          aria-valuenow={position}
          aria-valuetext={view.headline}
          aria-describedby="observation-help"
          onFocus={stop}
          onKeyDown={keyboard}
          onPointerDown={(event) => {
            event.stopPropagation();
            begin(event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            if (grab.current) move(event.clientY);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            release();
          }}
          onPointerCancel={release}
          onLostPointerCapture={release}
        >
          <span className={styles.handleArrows} aria-hidden="true">
            <ArrowUp size={13} />
            <ArrowDown size={13} />
          </span>
          <span className={styles.handleWords} aria-hidden="true">
            Move
            <br />
            the view
          </span>
        </div>
        <span className={styles.observationLabel} aria-hidden="true">
          what&apos;s visible
        </span>
      </div>

      <div className={styles.caption}>
        <div className={styles.possibilities} aria-hidden="true">
          {glyphIds.map((glyph) => (
            <span key={glyph} data-match={view.matches.includes(glyph)}>
              {glyph}
            </span>
          ))}
        </div>
        <p
          className={styles.statement}
          aria-live={previewing ? "off" : "polite"}
          aria-atomic="true"
          data-testid="observation-statement"
        >
          {view.headline}
        </p>
        <button
          ref={whyRef}
          className={styles.whyButton}
          type="button"
          aria-label="Explain this view"
          aria-expanded={explaining}
          aria-controls="observation-evidence"
          onClick={() => {
            stop();
            setExplaining((value) => !value);
          }}
        >
          Why<span aria-hidden="true">?</span>
        </button>
      </div>
      <p id="observation-help" className="sr-only">
        Move the band with the arrow keys, or drag its handle. Home moves to the
        top, End to the bottom. You can also tap a part of the drawing. Only the
        information inside the band is compared.
      </p>
      {explaining && (
        <div className={styles.evidence} id="observation-evidence">
          <div className={styles.evidenceHeading}>
            <h3>The shape stays the same. The view changes.</h3>
            <button
              type="button"
              aria-label="Close explanation"
              onClick={close}
            >
              <X size={17} />
            </button>
          </div>
          <p>
            The solid strokes are the part you can see. The coral outlines are
            possibilities that still agree with it.
          </p>
          <ul>
            {view.evidence.map((item) => (
              <li key={item.id} data-candidate={item.id}>
                <span className={styles.evidenceLetter}>{item.id}</span>
                <span>
                  <strong>
                    {item.matches ? "Still fits. " : "Doesn’t fit. "}
                  </strong>
                  {item.reason}
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.boundary}>
            This is a local comparison of three drawn shapes, sampled on a 2px
            grid. A match here only rules out the other shapes in this set; it
            isn&apos;t an AI prediction or a confidence score.
          </p>
        </div>
      )}
    </section>
  );
}
