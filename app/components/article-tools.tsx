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
