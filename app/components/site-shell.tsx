"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from "../theme-provider";
import { links } from "../lib/content";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
];

export function ThemeSwitch() {
  const { toggleTheme } = useTheme();
  return (
    <button
      className="icon-button theme-switch"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      <Moon className="moon-icon" size={18} aria-hidden="true" />
      <Sun className="sun-icon" size={18} aria-hidden="true" />
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function closeMenu() {
    dialog.current?.close();
    document.body.style.overflow = "";
    opener.current?.focus();
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => {
      if (media.matches) {
        dialog.current?.close();
        document.body.style.overflow = "";
      }
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = "";
      media.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Mahek Ara, home">
          <span className="trace-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Mahek Ara</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="resume-link"
            href={links.resume}
            target="_blank"
            rel="noreferrer"
          >
            Resume <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <ThemeSwitch />
          <button
            ref={opener}
            className="icon-button menu-trigger"
            aria-label="Open navigation"
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            onClick={() => {
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Navigation"
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closeMenu();
        }}
      >
        <div className="mobile-menu-inner">
          <button
            className="icon-button menu-close"
            onClick={closeMenu}
            aria-label="Close navigation"
            autoFocus
          >
            <X size={24} />
          </button>
          <nav aria-label="Mobile navigation">
            {navigation.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <span className="mono">0{index + 1}</span>
                {label}
                <ArrowUpRight size={20} />
              </Link>
            ))}
            <a
              href={links.resume}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              <span className="mono">
                {String(navigation.length + 1).padStart(2, "0")}
              </span>
              Resume
              <ArrowUpRight size={20} />
            </a>
          </nav>
          <div className="mobile-menu-footer">
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={15} />
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={15} />
            </a>
            <a
              href={links.x}
              target="_blank"
              rel="noreferrer"
              aria-label="Mahek Ara on X"
            >
              X <ArrowUpRight size={15} />
            </a>
            <ThemeSwitch />
          </div>
        </div>
      </dialog>
    </>
  );
}

export function SiteFooter() {
  const isHome = usePathname() === "/";
  return (
    <footer
      className={`site-footer${isHome ? " home-footer" : ""}`}
      id="contact"
    >
      <div>
        {!isHome && <span className="footer-greeting">Say hello.</span>}
        <a className="contact-link" href={links.email}>
          {links.email.replace("mailto:", "")}{" "}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="footer-links">
        <a href={links.github} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={14} />
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <ArrowUpRight size={14} />
        </a>
        <a
          href={links.x}
          target="_blank"
          rel="noreferrer"
          aria-label="Mahek Ara on X"
        >
          X <ArrowUpRight size={14} />
        </a>
        <a href={links.resume} target="_blank" rel="noreferrer">
          Resume <ArrowUpRight size={14} />
        </a>
      </div>
      {!isHome && (
        <div className="footer-bottom">
          <span>Mahek Ara</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      )}
    </footer>
  );
}
