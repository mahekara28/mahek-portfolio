"use client";

import { useEffect, useRef } from "react";

// One grid cell responds to the pointer on the empty desktop. No animation loop,
// tracking, or pointer replacement; nothing runs on touch or reduced motion.
export function DesktopGrid() {
  const cell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cell.current;
    if (!node || !node.parentElement) return;
    const element = node;
    const desktop = node.parentElement;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0;
    let y = 0;

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      element.removeAttribute("data-visible");
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.buttons || !(event.target instanceof Element)
        || event.target.closest(".md-window, .md-menubar, .md-shortcuts, .md-desk-footer, .md-empty")) {
        clear();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = desktop.getBoundingClientRect();
        element.style.setProperty("--cell-x", `${Math.floor((x - bounds.left) / 48) * 48}px`);
        element.style.setProperty("--cell-y", `${Math.floor((y - bounds.top) / 48) * 48}px`);
        element.setAttribute("data-visible", "true");
        frame = 0;
      });
    }
    desktop.addEventListener("pointermove", move, { passive: true });
    desktop.addEventListener("pointerleave", clear);
    window.addEventListener("blur", clear);
    media.addEventListener("change", clear);
    return () => {
      clear();
      desktop.removeEventListener("pointermove", move);
      desktop.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
      media.removeEventListener("change", clear);
    };
  }, []);

  return <div ref={cell} className="md-grid-focus" aria-hidden="true" />;
}
