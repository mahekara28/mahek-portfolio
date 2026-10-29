"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme-provider";
import { createSignatureScene, type SignatureScene, type SignatureState } from "../lib/signature-renderer";

export function SignatureField() {
  const { isDark } = useTheme();
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<SignatureScene | null>(null);
  const [state, setState] = useState<SignatureState>({ expanded: false, moving: false, reduced: false });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvas.current) return;
    scene.current = createSignatureScene(canvas.current, setState);
    const fallback = !scene.current ? requestAnimationFrame(() => setFailed(true)) : 0;
    return () => { cancelAnimationFrame(fallback); scene.current?.dispose(); scene.current = null; };
  }, []);
  useEffect(() => { scene.current?.theme(isDark); }, [isDark]);

  return (
    <section className="signature" data-testid="signature" data-expanded={state.expanded} data-moving={state.moving} aria-label="Mahek's computational signature">
      <button
        className="signature-stage"
        aria-label="Unfold the signature"
        aria-pressed={state.expanded}
        aria-describedby="signature-caption"
        onClick={() => scene.current ? scene.current.toggle() : setState((s) => ({ ...s, expanded: !s.expanded }))}
      >
        <canvas ref={canvas} aria-hidden="true" />
        {failed && <span className="signature-fallback" aria-hidden="true">M<span>A</span></span>}
      </button>
      <div className="signature-caption" id="signature-caption">
        <p>My initials, written in code.<br /><span>Hover to shift the strokes. Click to unfold.</span></p>
        <span className="signature-hint" aria-hidden="true">{state.expanded ? "fold it back ↙" : "another reading ↗"}</span>
      </div>
      <p className="sr-only" role="status">{state.expanded ? "The signature unfolds into Mahek Ara's full name." : "The strokes form Mahek's initials."}</p>
    </section>
  );
}
