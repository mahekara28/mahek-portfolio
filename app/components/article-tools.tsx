"use client";

import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CopyButton({
  text,
  label = "Copy code",
}: {
  text?: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text ?? window.location.href);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus("idle"), 2400);
  }
  return (
    <span className="copy-control">
      <button
        className="icon-button"
        aria-label={status === "copied" ? "Copied" : label}
        title={label}
        onClick={copy}
      >
        {status === "copied" ? (
          <Check size={16} />
        ) : text ? (
          <Copy size={16} />
        ) : (
          <LinkIcon size={16} />
        )}
      </button>
      <span className="copy-status" role="status">
        {status === "copied"
          ? "Copied"
          : status === "error"
            ? "Couldn't copy"
            : ""}
      </span>
    </span>
  );
}

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = document.getElementById("essay-body");
        if (!article || !bar.current) return;
        const bounds = article.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (window.innerHeight - bounds.top) / bounds.height),
        );
        bar.current.style.transform = `scaleX(${progress})`;
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}
