"use client";

import Link from "next/link";
import { useSelectedLayoutSegment, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ContactRound, Copy, FolderClosed, Mail, Moon, NotebookPen, Square, Sun, X } from "lucide-react";
import { links } from "../lib/content";
import { useTheme } from "../theme-provider";
import { WindowContent } from "./window-content";

const folders = [
  { href: "/", label: "About me", kind: "about", Icon: ContactRound },
  { href: "/blog", label: "Writing", kind: "writing", Icon: NotebookPen },
  { href: "/projects", label: "Projects", kind: "projects", Icon: FolderClosed },
  { href: "/contact", label: "Contact", kind: "contact", Icon: Mail },
];

export function DesktopShell({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const returnTo = useRef<string | null>(null);
  const navigation = useRef<HTMLElement>(null);
  const maximizeControl = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  const closed = segment === "desktop";
  const maximized = expanded && !closed;
  // Use the rendered route tree so unknown URLs share the server's 404 frame.
  const current = folders.find(({ href }) => href === "/" ? segment === null : segment === href.slice(1));
  const folderHref = current?.href ?? "/";

  useEffect(() => {
    if (closed && returnTo.current) {
      navigation.current?.querySelector<HTMLAnchorElement>(`a[href="${returnTo.current}"]`)?.focus();
      returnTo.current = null;
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !closed && !event.defaultPrevented) {
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
  }, [closed, folderHref, maximized, router]);

  return (
    <div className="desktop" data-maximized={maximized}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="md-menubar" inert={maximized}>
        <Link className="md-desktop-name" href="/" aria-label="Mahek’s introduction">
          <span className="md-monogram" aria-hidden="true">ma</span>
          <span>mahek’s desktop</span>
        </Link>
        <div className="md-menu-right">
          <nav className="md-socials" aria-label="Social profiles">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={links.x} target="_blank" rel="noreferrer">X</a>
          </nav>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isDark ? "Use stone theme" : "Use garden theme"} title={isDark ? "Use stone theme" : "Use garden theme"}>
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div className="md-workspace">
        <nav className="md-shortcuts" aria-label="Desktop folders" ref={navigation} inert={maximized}>
          {folders.map(({ href, label, kind, Icon }) => (
            <Link key={href} href={href} className="md-shortcut" data-open={kind} aria-current={!closed && current?.href === href ? "page" : undefined}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        {closed ? children : (
          <section className="md-window" data-maximized={maximized} aria-label={current?.label ?? "Mahek’s desktop"}>
            <header className="md-window-bar">
              <p className="md-window-title">{current?.label ?? "A little detour"}</p>
              <div className="md-window-controls">
                <button ref={maximizeControl} className="md-window-control md-maximize" type="button" aria-label={maximized ? "Restore window" : "Maximize window"} title={maximized ? "Restore window (Escape)" : "Maximize window"} aria-pressed={maximized} aria-controls="window-content" onClick={() => setExpanded(value => !value)}>
                  {maximized ? <Copy size={15} aria-hidden="true" /> : <Square size={15} aria-hidden="true" />}
                </button>
                <Link href="/desktop" scroll={false} className="md-window-control md-close" aria-label="Close window" title="Close window" onNavigate={() => { setExpanded(false); returnTo.current = folderHref; }}>
                  <X size={16} aria-hidden="true" />
                </Link>
              </div>
            </header>
            <WindowContent>{children}</WindowContent>
          </section>
        )}
      </div>
      <footer className="md-desk-footer" inert={maximized}>
        <p>A little corner of the internet.</p>
        <Link href="/">Mahek Ara</Link>
      </footer>
    </div>
  );
}
