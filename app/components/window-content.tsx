"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

export function WindowContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const historyTarget = useRef<string | null>(null);

  useEffect(() => {
    function rememberHistoryTarget() {
      historyTarget.current = window.location.pathname;
    }
    window.addEventListener("popstate", rememberHistoryTarget);
    return () => window.removeEventListener("popstate", rememberHistoryTarget);
  }, []);

  useLayoutEffect(() => {
    // The persistent desktop owns scrolling. New pages start at the top;
    // Back/Forward restores this window's reading position. Hash links retain
    // the browser's anchor behavior (including the expandable project archive).
    if (content.current && !window.location.hash) {
      content.current.scrollTop = historyTarget.current === pathname
        ? positions.current.get(pathname) ?? 0
        : 0;
    }
    historyTarget.current = null;
  }, [pathname]);

  return (
    <div id="window-content" className="md-window-content" ref={content} role="region" aria-label="Window content" tabIndex={0} onScroll={event => { positions.current.set(pathname, event.currentTarget.scrollTop); }}>
      {children}
    </div>
  );
}
