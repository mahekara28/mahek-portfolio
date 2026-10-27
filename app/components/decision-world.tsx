"use client";

import { ArrowRight, ArrowUpRight, Play, Pause, RotateCcw } from "lucide-react";
import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  examples,
  stages,
  points,
  edges,
  storyPath,
  edgeState,
  currentEdge,
  runExample,
  describeStage,
  storyReducer,
  initialStory,
  type PointId,
  type StoryState,
  type ExampleId,
} from "../lib/decision-sketch";
import styles from "./decision-world.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(change: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
}
const readMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => false;
// A quick first pass; the result gets longer to land than the transitions.
const stageDuration = [300, 1050, 900, 1500] as const;
function position(id: PointId): CSSProperties {
  return {
    "--x": points.desktop[id].x + "%",
    "--y": points.desktop[id].y + "%",
    "--mx": points.mobile[id].x + "%",
    "--my": points.mobile[id].y + "%",
  } as CSSProperties;
}

function StoryDrawing({
  state,
  mobile = false,
}: {
  state: StoryState;
  mobile?: boolean;
}) {
  const gradient = useId().replace(/:/g, "");
  const mode = mobile ? "mobile" : "desktop",
    width = mobile ? 360 : 1000,
    height = mobile ? 550 : 400;
  const example = runExample(state.exampleId, state.revised);
  const carrying = currentEdge(state);
  return (
    <svg
      className={mobile ? styles.mobileDrawing : styles.desktopDrawing}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradient}>
          <stop offset="0" stopColor="var(--signal)" stopOpacity=".24" />
          <stop offset=".65" stopColor="var(--signal)" stopOpacity=".06" />
          <stop offset="1" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gradient + "fold"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--stage-paper)" />
          <stop offset=".5" stopColor="var(--aperture)" stopOpacity=".7" />
          <stop offset="1" stopColor="var(--paper)" stopOpacity=".2" />
        </linearGradient>
      </defs>
      {edges.map((edge) => {
        const source = edge.id.startsWith("source");
        const route = edge.id === "lookup" || edge.id === "count";
        const selected = route && edge.id === example.tool;
        return (
          <g
            key={edge.id}
            className={`${styles.channel} ${edge.id === "return" || edge.id === "reflect" ? styles.feedbackChannel : ""}`}
            data-edge={edge.id}
            data-active={edgeState(edge.id, state)}
            data-route={route}
            data-selected={selected}
          >
            {!source && (
              <path
                className={styles.underlight}
                d={storyPath(edge.id, mobile)}
              />
            )}
            {Array.from(
              { length: source ? 1 : mobile ? 7 : 11 },
              (_, index) => {
                const strand = source ? 0 : index - (mobile ? 3 : 5);
                return (
                  <path
                    key={index}
                    className={strand === 0 ? styles.spine : styles.filament}
                    d={storyPath(edge.id, mobile, strand)}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              },
            )}
          </g>
        );
      })}
      {stages.map((stage, index) => {
        const p = points[mode][stage.id];
        return (
          <g
            key={stage.id}
            transform={`translate(${(p.x * width) / 100} ${(p.y * height) / 100})`}
            className={styles.aperture}
            data-selected={state.step === index}
            data-passed={state.step > index}
          >
            <ellipse
              className={styles.halo}
              rx={mobile ? 48 : 66}
              ry={mobile ? 50 : 62}
              fill={`url(#${gradient})`}
            />
            {index === 0 ? (
              <g className={styles.seed}>
                <path d="M 0 -13 Q 17 0 0 13 Q -17 0 0 -13 Z" />
                <path d="M 0 -8 V 8" />
              </g>
            ) : (
              <g
                className={styles.lens}
                transform={`rotate(${index === 2 ? 25 : -23})`}
              >
                <ellipse
                  className={styles.fold}
                  rx={index === 2 ? 22 : 18}
                  ry={index === 2 ? 39 : 31}
                  fill={`url(#${gradient}fold)`}
                />
                <ellipse
                  rx={index === 2 ? 16 : 12}
                  ry={index === 2 ? 32 : 25}
                  fill="none"
                />
                <path className={styles.slit} d="M 0 -14 V 14" />
              </g>
            )}
          </g>
        );
      })}
      {carrying && (
        <g
          key={`${state.exampleId}-${state.pass}-${state.step}`}
          className={styles.signalRun}
          style={{
            animationPlayState:
              state.status === "paused" ? "paused" : "running",
          }}
        >
          <path
            className={`${styles.signal} ${styles.signalTrail} ${carrying === "return" || carrying === "reflect" ? styles.feedbackSignal : ""}`}
            d={storyPath(carrying, mobile)}
            pathLength="1000"
          />
          <path
            className={`${styles.signal} ${carrying === "return" || carrying === "reflect" ? styles.feedbackSignal : ""}`}
            d={storyPath(carrying, mobile)}
            pathLength="1000"
          />
          {state.step === 1 &&
            (["sourceOne", "sourceTwo"] as const).map((id) => (
              <path
                key={id}
                className={`${styles.signal} ${styles.sourceSignal}`}
                d={storyPath(id, mobile)}
                pathLength="1000"
              />
            ))}
        </g>
      )}
    </svg>
  );
}

export function DecisionWorld() {
  const [state, dispatch] = useReducer(storyReducer, initialStory);
  const [hintStage, setHintStage] = useState<number | null>(null);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    readMotion,
    serverMotion,
  );
  const stageButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const exampleButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const surface = useRef<HTMLDivElement | null>(null);
  const autoPlayed = useRef(false);
  const example = runExample(state.exampleId, state.revised);
  const note = describeStage(state.step, state.exampleId, state.revised);
  const running = state.status === "playing" && !reduced;
  const quickNotes = [
    "Turn an idea into a question the system can work with.",
    "Bring in the facts the question depends on.",
    example.tool === "lookup"
      ? "Read the docs for exact steps instead of guessing."
      : "Count the reports with code instead of asking a model to guess.",
    "The selected tool produces a result you can use.",
    "A correction becomes new context for the next pass.",
  ];

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => dispatch({ type: "tick" }),
      stageDuration[Math.min(state.step, 3)],
    );
    return () => window.clearTimeout(timer);
  }, [running, state.step, state.pass]);

  useEffect(() => {
    const field = surface.current;
    if (!field || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.45) {
          dispatch({ type: "pause" });
          return;
        }
        // Play once when the drawing is visible, unless the visitor took control.
        if (
          !autoPlayed.current &&
          !document.hidden &&
          !window.matchMedia(motionQuery).matches
        ) {
          autoPlayed.current = true;
          dispatch({ type: "play" });
        }
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(field);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    // Do not let an example finish unseen in a background tab.
    const pauseHidden = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    const media = window.matchMedia(motionQuery);
    const pauseReduced = () => {
      if (media.matches) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseHidden);
    media.addEventListener("change", pauseReduced);
    return () => {
      document.removeEventListener("visibilitychange", pauseHidden);
      media.removeEventListener("change", pauseReduced);
    };
  }, []);

  function chooseExample(id: ExampleId) {
    autoPlayed.current = true;
    setHintStage(null);
    dispatch({ type: "example", id, autoplay: !reduced });
  }

  function move(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    kind: "stage" | "example",
  ) {
    const list = kind === "stage" ? stages : examples;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % list.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + list.length - 1) % list.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = list.length - 1;
    else return;
    event.preventDefault();
    if (kind === "stage") {
      dispatch({ type: "inspect", step: next });
      stageButtons.current[next]?.focus();
    } else {
      chooseExample(examples[next].id);
      exampleButtons.current[next]?.focus();
    }
  }
  const playLabel = reduced
    ? state.step === 4
      ? "Start over"
      : "Next stage"
    : running
      ? "Pause"
      : state.step === 4
        ? "Replay example"
        : state.status === "paused"
          ? "Continue"
          : "Run example";

  return (
    <section
      className={styles.world}
      aria-labelledby="world-title"
      data-example={state.exampleId}
      data-step={state.step}
      data-revised={state.revised}
      data-playing={running}
      onFocusCapture={() => {
        autoPlayed.current = true;
      }}
      onPointerDownCapture={(event) => {
        autoPlayed.current = true;
        if (!(event.target as Element).closest("[data-stage]"))
          setHintStage(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setHintStage(null);
      }}
    >
      <div className={styles.toolbar}>
        <span className={styles.worldKicker}>Follow the thread</span>
        <div
          className={styles.choices}
          role="group"
          aria-label="Choose an example"
        >
          {examples.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state.exampleId === item.id}
              ref={(node) => {
                exampleButtons.current[index] = node;
              }}
              onClick={() => chooseExample(item.id)}
              onKeyDown={(event) => move(event, index, "example")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.promptBar}>
        <h2 id="world-title">{example.question}</h2>
        <div className={styles.playControls}>
          <button
            className={styles.play}
            type="button"
            onClick={() =>
              reduced
                ? dispatch(
                    state.step === 4
                      ? { type: "restart", reduced: true }
                      : { type: "next" },
                  )
                : dispatch({ type: "play" })
            }
          >
            {running ? (
              <Pause size={14} aria-hidden="true" />
            ) : state.step === 4 ? (
              <RotateCcw size={14} aria-hidden="true" />
            ) : (
              <Play size={14} aria-hidden="true" />
            )}
            {playLabel}
          </button>
          {!reduced && (
            <button
              className={styles.next}
              type="button"
              aria-label="Next stage"
              disabled={state.step === 4}
              onClick={() => dispatch({ type: "next" })}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={surface}
        className={styles.worldSurface}
        data-testid="decision-world"
      >
        <StoryDrawing state={state} />
        <StoryDrawing state={state} mobile />
        {stages.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            className={styles.node}
            style={position(stage.id)}
            data-stage={stage.id}
            data-selected={state.step === index}
            data-passed={state.step > index}
            aria-label={`Explore ${stage.label}`}
            aria-pressed={state.step === index}
            aria-controls="decision-insight"
            aria-describedby={
              hintStage === index && state.step === index && !running
                ? "story-stage-tip"
                : undefined
            }
            ref={(node) => {
              stageButtons.current[index] = node;
            }}
            onClick={() => {
              dispatch({ type: "inspect", step: index });
              setHintStage(index);
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") {
                autoPlayed.current = true;
                dispatch({ type: "inspect", step: index });
                setHintStage(index);
              }
            }}
            onFocus={() => {
              dispatch({ type: "inspect", step: index });
              setHintStage(index);
            }}
            onBlur={() => setHintStage(null)}
            onKeyDown={(event) => move(event, index, "stage")}
          >
            <span className={styles.nodeNumber}>0{index + 1}</span>
            <span className={styles.nodeLabel}>{stage.label}</span>
            <span className={styles.nodeHint}>{stage.hint}</span>
          </button>
        ))}
        {hintStage === state.step && !running && (
          <div
            id="story-stage-tip"
            role="tooltip"
            className={styles.stageTip}
            data-tip={stages[state.step].id}
            style={position(stages[state.step].id)}
          >
            {quickNotes[state.step]}
          </div>
        )}
        {(["lookup", "count"] as const).map((tool) => (
          <span
            key={tool}
            className={styles.toolLabel}
            style={position(tool)}
            data-tool={tool}
            data-active={example.tool === tool && state.step >= 2}
          >
            {tool === "lookup" ? "Read docs" : "Count issues"}
          </span>
        ))}
        {(["sourceOne", "sourceTwo"] as const).map((id, index) => (
          <span
            key={id}
            className={styles.source}
            style={position(id)}
            data-source={id}
            data-active={state.step >= 1}
          >
            {example.sources[index]}
          </span>
        ))}
      </div>

      <p className="sr-only" role="status">
        Step {state.step + 1} of 5: {stages[state.step].label}.
        {state.revised ? " Second pass, with your feedback." : ""}
      </p>
      <div
        className={styles.readout}
        id="decision-insight"
        aria-live={running ? "off" : "polite"}
        aria-atomic="true"
      >
        <div className={styles.insight}>
          <span className={styles.stepCount}>0{state.step + 1} / 05</span>
          <h3>{note.title}</h3>
        </div>
        <div className={styles.evidence} data-testid="story-evidence">
          {state.step > 0 && (
            <p>{state.step < 3 ? note.excerpt : example.result}</p>
          )}
          {state.step === 4 && !state.revised && (
            <button
              className={styles.feedbackButton}
              type="button"
              onClick={() => dispatch({ type: "feedback", reduced })}
            >
              Add: “{example.feedback}”{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          )}
          <details
            className={styles.inside}
            onToggle={(event) => {
              if (event.currentTarget.open) dispatch({ type: "pause" });
            }}
          >
            <summary>
              Look inside <span aria-hidden="true">+</span>
            </summary>
            <div className={styles.insideBody}>
              <p>{note.text}</p>
              <pre>{state.step < 3 ? note.excerpt : example.detail}</pre>
              {state.revised && (
                <p className={styles.passNote}>
                  Second pass · your feedback changed the context.
                </p>
              )}
            </div>
          </details>
        </div>
      </div>
      <div className={styles.worldFooter}>
        <p>Local sketch · sample data · no model calls</p>
      </div>
    </section>
  );
}
