"use client";

import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from "react";

type Point = { x: number; y: number };
type Drag = { id: string; pointerId: number; start: Point; origin: Point; moved: boolean };
const zero: Point = { x: 0, y: 0 };

/** Keep the window in normal document flow until it is moved. */
export function useDesktopArrangement(workspace: RefObject<HTMLDivElement | null>, maximized: boolean) {
  const [offsets, setOffsets] = useState<Record<string, Point>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const positions = useRef<Record<string, Point>>({});
  const elements = useRef(new Map<string, HTMLElement>());
  const active = useRef<Drag | null>(null);
  const suppressClick = useRef<{ id: string; until: number } | null>(null);
  const expanded = useRef(maximized);

  useEffect(() => { expanded.current = maximized; }, [maximized]);

  function constrain(id: string, point: Point): Point {
    const element = elements.current.get(id);
    const boundary = workspace.current?.getBoundingClientRect();
    if (!element || !boundary) return point;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return positions.current[id] ?? zero;
    const previous = positions.current[id] ?? zero;
    const base = { x: rect.left - previous.x, y: rect.top - previous.y };
    const min = { x: boundary.left + 6 - base.x, y: boundary.top + 6 - base.y };
    const max = { x: boundary.right - rect.width - 6 - base.x, y: boundary.bottom - rect.height - 6 - base.y };
    return {
      x: Math.round(Math.min(Math.max(min.x, max.x), Math.max(min.x, point.x))),
      y: Math.round(Math.min(Math.max(min.y, max.y), Math.max(min.y, point.y))),
    };
  }

  function place(id: string, point: Point) {
    const next = constrain(id, point);
    positions.current = { ...positions.current, [id]: next };
    // Update synchronously too: consecutive pointer events must measure the new position.
    const element = elements.current.get(id);
    if (element) element.style.transform = `translate(${next.x}px, ${next.y}px)`;
    setOffsets(positions.current);
  }

  useEffect(() => {
    const container = workspace.current;
    if (!container) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // A new viewport gets the usable default arrangement. Navigation preserves it.
        active.current = null;
        positions.current = {};
        elements.current.forEach((element, id) => {
          if (!(id === "window" && expanded.current)) element.style.transform = "";
        });
        setOffsets({});
        setDragging(null);
      });
    });
    observer.observe(container);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [workspace]);

  function reset() {
    active.current = null;
    positions.current = {};
    elements.current.forEach(element => { element.style.transform = ""; });
    setOffsets({});
    setDragging(null);
  }

  function handle(id: string, enabled = true) {
    return {
      onPointerDown(event: PointerEvent<HTMLElement>) {
        if (!enabled || event.button !== 0 || !event.isPrimary) return;
        active.current = { id, pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: positions.current[id] ?? zero, moved: false };
        // Capture immediately so a fast gesture cannot outrun the title bar.
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event: PointerEvent<HTMLElement>) {
        const drag = active.current;
        if (!enabled || drag?.id !== id || drag.pointerId !== event.pointerId) return;
        const dx = event.clientX - drag.start.x, dy = event.clientY - drag.start.y;
        if (!drag.moved && Math.hypot(dx, dy) < 6) return;
        if (!drag.moved) {
          drag.moved = true;
          event.currentTarget.focus({ preventScroll: true });
          setDragging(id);
        }
        event.preventDefault();
        place(id, { x: drag.origin.x + dx, y: drag.origin.y + dy });
      },
      onPointerUp(event: PointerEvent<HTMLElement>) {
        const drag = active.current;
        if (drag?.id !== id || drag.pointerId !== event.pointerId) return;
        if (drag.moved) suppressClick.current = { id, until: performance.now() + 500 };
        active.current = null;
        setDragging(null);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      },
      onPointerCancel() { active.current = null; setDragging(null); },
      onLostPointerCapture() { active.current = null; setDragging(null); },
      onClickCapture(event: MouseEvent<HTMLElement>) {
        if (event.detail && suppressClick.current?.id === id && performance.now() < suppressClick.current.until) {
          suppressClick.current = null;
          event.preventDefault();
          event.stopPropagation();
        }
      },
      onKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (!enabled || (id !== "window" && !event.altKey)) return;
        const directions: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
        const direction = directions[event.key];
        if (!direction) return;
        event.preventDefault();
        event.stopPropagation();
        const step = event.shiftKey ? 4 : 24, current = positions.current[id] ?? zero;
        place(id, { x: current.x + direction.x * step, y: current.y + direction.y * step });
      },
      onDragStart(event: DragEvent<HTMLElement>) { event.preventDefault(); },
    };
  }

  function item(id: string, enabled = true) {
    const point = offsets[id] ?? zero;
    return {
      ref: (element: HTMLElement | null) => { if (element) elements.current.set(id, element); else elements.current.delete(id); },
      style: { transform: enabled && (point.x || point.y) ? `translate(${point.x}px, ${point.y}px)` : undefined } as CSSProperties,
      "data-dragging": dragging === id,
    };
  }

  return { handle, item, reset, dragging };
}
