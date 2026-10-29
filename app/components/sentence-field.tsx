"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../theme-provider";
import { duration, phases, prompt, sentenceAt } from "../lib/sentence-study";
import { createSentenceScene, type SceneState, type SentenceScene } from "../lib/sentence-renderer";

export function SentenceField() {
  const { isDark } = useTheme();
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const scene = useRef<SentenceScene | null>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<SceneState>({
    ...sentenceAt(0, 0), context: 0, playing: false, reduced: false, manual: false,
  });

  useEffect(() => {
    if (!canvas.current) return;
    scene.current = createSentenceScene(
      canvas.current,
      labels.current.filter((el): el is HTMLSpanElement => !!el),
      setState,
    );
    const fallbackFrame = !scene.current ? requestAnimationFrame(() => {
      setFailed(true);
      setState((current) => ({ ...current, ...sentenceAt(duration(current.context), current.context) }));
    }) : 0;
    return () => {
      cancelAnimationFrame(fallbackFrame);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);
  useEffect(() => { scene.current?.theme(isDark); }, [isDark]);

  function explore() {
    if (scene.current) scene.current.explore();
    else setState((current) => {
      const context = current.context === 0 ? 1 : 0;
      return { ...current, ...sentenceAt(duration(context), context), context, manual: true };
    });
  }

  return (
    <section
      className="sentence-study"
      aria-label="An illustrated next-token generation loop"
      data-testid="sentence-study"
      data-phase={state.phase}
      data-step={state.step}
      data-complete={state.complete}
      data-playing={state.playing}
      data-context={state.context}
    >
      <div className="study-heading">
        <span>{prompt}</span>
        <span className="study-instruction">{state.context === 0 ? "Short answer" : "A little more context"}</span>
      </div>
      <button
        className="sentence-stage"
        onClick={explore}
        aria-label="Change the instruction in the token illustration"
        aria-describedby="study-hint"
      >
        <canvas ref={canvas} aria-hidden="true" />
        {!failed && state.candidates.map((candidate, i) => (
          <span
            key={i}
            ref={(el) => { labels.current[i] = el; }}
            aria-hidden="true"
            className={`sentence-branch${state.selected === i ? " selected" : state.selected !== null ? " withdrawn" : ""}`}
          >{state.complete ? state.selected === i ? "answer" : "" : candidate.trim()}</span>
        ))}
        {failed && <span className="canvas-fallback">One token joins the answer, then becomes context for the next.</span>}
      </button>
      <div className="sentence-result">
        <div className="study-state">
          <span>{state.complete ? "The answer so far" : phases[state.phase]}</span>
          <span id="study-hint">Click or tap the field to explore</span>
        </div>
        <p className="sentence"><span className="completion">{state.completion || "…"}</span></p>
        <p className="sr-only" data-testid="generation-context">Context: {state.contextText}</p>
        <p className="sr-only" role="status">{state.manual && state.complete ? `Illustrated answer: ${state.completion}` : ""}</p>
      </div>
      <details className="study-explanation">
        <summary><span>What&apos;s happening here?</span><Plus size={13} aria-hidden="true" /></summary>
        <div>
          <p>An LLM writes in small pieces called tokens. Each choice becomes part of the context for the next. The bright path follows that loop.</p>
          <p>Tap the field to change the instruction. This is a simplified sketch with preset text, not a live model.</p>
        </div>
      </details>
    </section>
  );
}
