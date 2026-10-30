"use client";

import Link from "next/link";
import { useSelectedLayoutSegment, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Plus, X, Copy, RotateCcw, Sun, Moon } from "lucide-react";
import { links } from "../lib/content";
import { WindowContent } from "./window-content";
import { DesktopIcon, type DesktopIconKind } from "./desktop-icon";
import { BrandMark } from "./brand-mark";
import { DesktopRest } from "./desktop-rest";
import { useDesktopArrangement } from "./use-desktop-arrangement";
import { useTheme } from "../theme-provider";

const folders: { href: string; label: string; kind: DesktopIconKind }[] = [
  { href: "/", label: "About me", kind: "about" },
  { href: "/blog", label: "Writing", kind: "writing" },
  { href: "/projects", label: "Projects", kind: "projects" },
  { href: "/contact", label: "Contact", kind: "contact" },
];

export function DesktopShell({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme();
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const returnTo = useRef<string | null>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const maximizeControl = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [minimizedSegment, setMinimizedSegment] = useState<string | null | undefined>(undefined);
  const closed = segment === "desktop";
  const minimized = minimizedSegment !== undefined && minimizedSegment === segment && !closed;
  const maximized = expanded && !closed && !minimized;
  const arrangement = useDesktopArrangement(workspace, maximized);
  const current = folders.find(({ href }) => href === "/" ? segment === null : segment === href.slice(1));
  const folderHref = current?.href ?? "/";

  function reveal() { setMinimizedSegment(undefined); }
  function focusFolder() {
    requestAnimationFrame(() => navigation.current?.querySelector<HTMLAnchorElement>(`a[href="${folderHref}"]`)?.focus());
  }
  function minimize() { setMinimizedSegment(segment); focusFolder(); }

  useEffect(() => {
    if (closed && returnTo.current) {
      navigation.current?.querySelector<HTMLAnchorElement>(`a[href="${returnTo.current}"]`)?.focus();
      returnTo.current = null;
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !closed && !minimized && !event.defaultPrevented) {
        event.preventDefault();
        if (maximized) {
          setExpanded(false);
          maximizeControl.current?.focus();
          return;
        }
        returnTo.current = folderHref;
        router.push("/desktop", { scroll: false });
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closed, folderHref, maximized, minimized, router]);

  return (
    <div className="desktop" data-maximized={maximized} data-dragging={Boolean(arrangement.dragging)}>
      <a className="skip-link" href={minimized ? "#desktop-main" : "#main"}>Skip to content</a>
      <p className="sr-only" id="window-move-help">Drag the title bar to move the window. When this title is focused, use arrow keys to move, or Shift and arrow keys for smaller steps. Double-click to maximize or restore.</p>
      <header className="md-menubar" inert={maximized}>
        <Link className="md-desktop-name" href="/" aria-label="Mahek’s introduction" title="Mahek Ara" onClick={reveal}>
          <BrandMark />
        </Link>
        <div className="md-menu-actions">
          <button className="md-theme-toggle" type="button" onClick={toggleTheme} aria-label="Switch color theme">
            <span className="md-show-in-dark"><Sun size={15} aria-hidden="true" /> Light mode</span>
            <span className="md-show-in-light"><Moon size={15} aria-hidden="true" /> Dark mode</span>
          </button>
          <nav className="md-socials" aria-label="Social profiles">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38l-.01-1.49c-2.23.48-2.7-.94-2.7-.94-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.87c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49l-.01 2.21c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="9" width="4" height="12" rx=".5" /><circle cx="5" cy="5" r="2.2" /><path d="M10 9h4v1.7c.7-1.2 1.8-2 3.5-2 3.2 0 4.5 2 4.5 5.2V21h-4v-6.2c0-1.6-.5-2.6-1.9-2.6s-2.1 1-2.1 2.6V21h-4Z" /></svg>
            </a>
            <a href={links.x} target="_blank" rel="noreferrer" aria-label="X" title="X"><span aria-hidden="true" className="md-x-mark">𝕏</span></a>
          </nav>
        </div>
      </header>
      <div className="md-workspace" ref={workspace}>
        <nav className="md-shortcuts" aria-label="Desktop folders" ref={navigation} inert={maximized}>
          {folders.map(({ href, label, kind }) => (
            <Link key={kind} href={href} className="md-shortcut" data-open={kind} draggable={false}
              aria-current={!closed && !minimized && current?.href === href ? "page" : undefined} onClick={reveal}>
              <DesktopIcon kind={kind} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        {closed ? children : <>
          {minimized && <DesktopRest id="desktop-main" />}
          <section className="md-window" {...arrangement.item("window", !maximized)} data-maximized={maximized} hidden={minimized} aria-label={current?.label ?? "Mahek’s desktop"}>
            <header className="md-window-bar">
              <div className="md-window-controls">
                <Link href="/desktop" scroll={false} className="md-window-control md-close" aria-label="Close window" title="Close window" onNavigate={() => { setExpanded(false); reveal(); returnTo.current = folderHref; }}>
                  <span><X size={9} aria-hidden="true" /></span>
                </Link>
                <button className="md-window-control md-minimize" type="button" aria-label="Minimize window" title="Minimize window" onClick={minimize}>
                  <span><Minus size={9} aria-hidden="true" /></span>
                </button>
                <button ref={maximizeControl} className="md-window-control md-maximize" type="button" aria-label={maximized ? "Restore window" : "Maximize window"} title={maximized ? "Restore window (Escape)" : "Maximize window"} aria-pressed={maximized} aria-controls="window-content" onClick={() => setExpanded(value => !value)}>
                  <span>{maximized ? <Copy size={8} aria-hidden="true" /> : <Plus size={9} aria-hidden="true" />}</span>
                </button>
              </div>
              <button className="md-window-drag" type="button" aria-label="Move window" aria-describedby="window-move-help" {...arrangement.handle("window", !maximized)} onDoubleClick={() => setExpanded(value => !value)}>
                <span className="md-window-title">{current?.label ?? "A little detour"}</span>
              </button>
            </header>
            <WindowContent>{children}</WindowContent>
          </section>
        </>}
      </div>
      <footer className="md-desk-footer" inert={maximized}>
        <p>Built with curiosity. Always a work in progress.</p>
        <div className="md-desktop-actions">
          {minimized && <button className="md-resume-window" onClick={() => { reveal(); requestAnimationFrame(() => maximizeControl.current?.focus()); }}>Open {current?.label ?? "window"}</button>}
          <button className="md-reset-layout" onClick={arrangement.reset} title="Reset the window position"><RotateCcw size={13} aria-hidden="true" /> Reset window</button>
        </div>
      </footer>
    </div>
  );
}
