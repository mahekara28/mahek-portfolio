"use client";

import Link from "next/link";
import { useSelectedLayoutSegment, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { ContactRound, FolderClosed, Mail, Moon, NotebookPen, Sun, X } from "lucide-react";
import { links } from "../lib/content";
import { useTheme } from "../theme-provider";

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
  const closed = segment === "desktop";
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
        returnTo.current = folderHref;
        router.push("/desktop", { scroll: false });
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closed, folderHref, router]);

  return (
    <div className="desktop">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="md-menubar">
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
        <nav className="md-shortcuts" aria-label="Desktop folders" ref={navigation}>
          {folders.map(({ href, label, kind, Icon }) => (
            <Link key={href} href={href} className="md-shortcut" data-open={kind} aria-current={!closed && current?.href === href ? "page" : undefined}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        {closed ? children : (
          <section className="md-window" aria-label={current?.label ?? "Mahek’s desktop"}>
            <header className="md-window-bar">
              <p className="md-window-title">{current?.label ?? "A little detour"}</p>
              <Link href="/desktop" className="md-close" aria-label="Close window" title="Close window (Escape)" onClick={() => { returnTo.current = folderHref; }}>
                <X size={16} aria-hidden="true" />
              </Link>
            </header>
            {children}
          </section>
        )}
      </div>
      <footer className="md-desk-footer">
        <p>A little corner of the internet.</p>
        <Link href="/">Mahek Ara</Link>
      </footer>
    </div>
  );
}
