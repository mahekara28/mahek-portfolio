"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProjectArchive({ children }: { children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function revealTarget() {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target && details.current?.contains(target)) {
        details.current.open = true;
        target.scrollIntoView({ block: "start" });
      }
    }
    revealTarget();
    window.addEventListener("hashchange", revealTarget);
    return () => window.removeEventListener("hashchange", revealTarget);
  }, []);
  return <details className="md-archive" ref={details}><summary>Earlier experiments</summary>{children}</details>;
}
