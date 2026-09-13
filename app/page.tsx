"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

const statusPhrases = [
  "mapping intelligence",
  "routing context",
  "orchestrating tools",
  "building useful systems",
];

const introLine =
  "Building practical AI systems with LLMs, agents, automation and AI security.";

function useTypedLoop(phrases: string[], typingSpeed = 64, pause = 1300) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const finishedTyping = !isDeleting && text === current;
    const finishedDeleting = isDeleting && text === "";

    const timeout = window.setTimeout(
      () => {
        if (finishedTyping) {
          setIsDeleting(true);
          return;
        }

        if (finishedDeleting) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          return;
        }

        setText(
          isDeleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1),
        );
      },
      finishedTyping ? pause : isDeleting ? typingSpeed / 1.8 : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [isDeleting, pause, phraseIndex, phrases, text, typingSpeed]);

  return text;
}

function useTypeOnce(value: string, speed = 42, delay = 0) {
  const [text, setText] = useState("");

  useEffect(() => {
    const startTimeout = window.setTimeout(() => {
      let index = 0;

      const interval = window.setInterval(() => {
        index += 1;
        setText(value.slice(0, index));

        if (index >= value.length) {
          window.clearInterval(interval);
        }
      }, speed);

      return () => window.clearInterval(interval);
    }, delay);

    return () => window.clearTimeout(startTimeout);
  }, [delay, speed, value]);

  return text;
}

function GitHubIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.095.682-.222.682-.495 0-.244-.009-.89-.014-1.748-2.782.618-3.369-1.378-3.369-1.378-.455-1.18-1.111-1.495-1.111-1.495-.909-.637.069-.624.069-.624 1.004.073 1.532 1.056 1.532 1.056.893 1.567 2.341 1.115 2.91.852.091-.664.349-1.116.635-1.372-2.221-.261-4.556-1.139-4.556-5.07 0-1.12.389-2.036 1.029-2.753-.103-.261-.446-1.314.098-2.738 0 0 .839-.276 2.75 1.051A9.32 9.32 0 0 1 12 6.83a9.3 9.3 0 0 1 2.505.349c1.91-1.327 2.748-1.051 2.748-1.051.546 1.424.202 2.477.1 2.738.641.717 1.028 1.633 1.028 2.753 0 3.941-2.339 4.806-4.568 5.062.359.317.678.942.678 1.899 0 1.371-.012 2.476-.012 2.812 0 .275.18.595.688.494C19.138 20.617 22 16.777 22 12.25 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({
  className = "h-[18px] w-[18px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.983 3.5C4.983 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.113 1 2.483 1s2.5 1.119 2.5 2.5ZM.291 8.25h4.384V23H.291V8.25ZM8.04 8.25h4.203v2.014h.06c.585-1.116 2.014-2.293 4.145-2.293 4.434 0 5.252 2.971 5.252 6.834V23h-4.379v-7.298c0-1.741-.031-3.979-2.381-3.979-2.384 0-2.75 1.9-2.75 3.853V23H8.04V8.25Z" />
    </svg>
  );
}

function NavIconLink({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  const baseClass =
    "group relative flex h-11 w-11 items-center justify-center rounded-full border border-current/12 transition duration-300 hover:scale-[1.03] hover:text-emerald-400";

  const labelNode = (
    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.6rem)] -translate-x-1/2 whitespace-nowrap rounded-full border border-current/12 bg-inherit px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] opacity-0 shadow-sm transition duration-300 group-hover:translate-y-1 group-hover:opacity-100">
      {label}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className={baseClass}
      >
        {icon}
        {labelNode}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label} className={baseClass}>
      {icon}
      {labelNode}
    </Link>
  );
}

function McpFlowVisual({
  dark,
  compact = false,
}: {
  dark: boolean;
  compact?: boolean;
}) {
  const ring = dark ? "border-white/8" : "border-black/8";
  const softRing = dark ? "border-emerald-400/18" : "border-emerald-700/18";
  const panel = dark ? "bg-[#07110c]/78" : "bg-white/72";
  const text = dark ? "text-white/54" : "text-black/46";
  const pathColor = dark ? "rgba(52,211,153,0.25)" : "rgba(16,185,129,0.22)";

  const nodes = compact
    ? [
        { label: "PROMPT", left: "10%", top: "32%" },
        { label: "TOOLS", left: "74%", top: "18%" },
        { label: "MEMORY", left: "76%", top: "66%" },
      ]
    : [
        { label: "PROMPT", left: "11%", top: "32%" },
        { label: "MCP TOOLS", left: "76%", top: "16%" },
        { label: "RETRIEVAL", left: "78%", top: "66%" },
        { label: "MEMORY", left: "14%", top: "74%" },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, x: compact ? 0 : 24, y: compact ? 8 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.85, delay: 0.18 }}
      className={`relative ${compact ? "h-[230px] w-[230px]" : "h-[520px] w-full max-w-[560px]"}`}
    >
      <motion.div
        animate={{
          scale: [0.96, 1.06, 0.96],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[70px] ${
          compact ? "h-[138px] w-[138px]" : "h-[290px] w-[290px]"
        }`}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${ring} ${
          compact ? "h-[186px] w-[186px]" : "h-[390px] w-[390px]"
        }`}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed ${softRing} ${
          compact ? "h-[118px] w-[118px]" : "h-[250px] w-[250px]"
        }`}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M18 36 C34 30, 42 36, 50 50"
          stroke={pathColor}
          strokeWidth="0.38"
          fill="none"
          strokeDasharray="1.8 1.8"
          animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.2, 0.84, 0.2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M76 22 C68 30, 58 38, 50 50"
          stroke={pathColor}
          strokeWidth="0.38"
          fill="none"
          strokeDasharray="1.8 1.8"
          animate={{ pathLength: [0.18, 1, 0.18], opacity: [0.18, 0.82, 0.18] }}
          transition={{ duration: 4.2, delay: 0.25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M80 69 C70 62, 60 57, 50 50"
          stroke={pathColor}
          strokeWidth="0.38"
          fill="none"
          strokeDasharray="1.8 1.8"
          animate={{ pathLength: [0.16, 1, 0.16], opacity: [0.16, 0.78, 0.16] }}
          transition={{ duration: 4.8, delay: 0.55, repeat: Infinity, ease: "easeInOut" }}
        />
        {!compact && (
          <motion.path
            d="M20 74 C32 66, 41 59, 50 50"
            stroke={pathColor}
            strokeWidth="0.38"
            fill="none"
            strokeDasharray="1.8 1.8"
            animate={{ pathLength: [0.18, 1, 0.18], opacity: [0.16, 0.82, 0.16] }}
            transition={{ duration: 4.6, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </svg>

      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.34, 0.92, 0.34],
          }}
          transition={{
            duration: 3.9,
            delay: index * 0.24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full border border-white/10 px-3 py-2 backdrop-blur-md ${panel} ${compact ? "opacity-80" : ""}`}
          style={{ left: node.left, top: node.top }}
        >
          <span
            className={`block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] ${
              dark ? "text-white/48" : "text-black/45"
            }`}
          >
            {node.label}
          </span>
        </motion.div>
      ))}

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <motion.div
          animate={{
            scale: [0.97, 1.04, 0.97],
            boxShadow: [
              "0 0 0 0 rgba(16,185,129,0.08)",
              "0 0 0 16px rgba(16,185,129,0.02)",
              "0 0 0 0 rgba(16,185,129,0.08)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`relative flex items-center justify-center rounded-full border border-emerald-400/24 bg-emerald-400/8 ${
            compact ? "h-[78px] w-[78px]" : "h-[138px] w-[138px]"
          }`}
        >
          <div
            className={`absolute rounded-full border border-emerald-400/18 ${
              compact ? "inset-3" : "inset-4"
            }`}
          />
          <div
            className={`absolute rounded-full border border-emerald-400/10 ${
              compact ? "inset-6" : "inset-7"
            }`}
          />
          <div className="text-center">
            <p className={`text-[9px] uppercase tracking-[0.28em] ${text}`}>
              Live flow
            </p>
            <p
              className={`mt-2 font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-white" : "text-[#0e1711]"
              } ${compact ? "text-[10px]" : "text-sm"}`}
            >
              Agent
              <br />
              Router
            </p>
          </div>
        </motion.div>
      </div>

      {!compact && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.28em] ${
            dark ? "text-white/26" : "text-black/28"
          }`}
        >
          prompt • tools • memory • response
        </div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const typedStatus = useTypedLoop(statusPhrases, 60, 1150);
  const typedFirstName = useTypeOnce("MAHEK", 34, 60);
  const typedLastName = useTypeOnce("ARA", 34, 240);
  const typedIntro = useTypeOnce(introLine, 16, 520);

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        isDark ? "bg-[#060806] text-white" : "bg-[#f4f7f2] text-[#111512]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 36, 0],
            y: [0, -24, 0],
            opacity: [0.14, 0.24, 0.14],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-44 top-16 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -26, 0],
            y: [0, 22, 0],
            opacity: [0.09, 0.16, 0.09],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-36 bottom-0 h-[320px] w-[320px] rounded-full bg-emerald-400/10 blur-[120px]"
        />
      </div>

      <header
        className={`relative z-40 border-b ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 py-5 sm:px-6 md:px-10">
          <Link href="/" className="flex items-center">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[12px] font-semibold tracking-[0.12em] transition ${
                isDark
                  ? "border-white/16 text-white hover:border-emerald-400 hover:text-emerald-300"
                  : "border-black/14 text-[#0f1411] hover:border-emerald-600 hover:text-emerald-700"
              }`}
            >
              MA
            </span>
          </Link>

          <div
            className={`flex items-center gap-2.5 sm:gap-3 ${
              isDark ? "text-white/74" : "text-black/66"
            }`}
          >
            <NavIconLink
              href="/projects"
              label="Work"
              icon={<BriefcaseBusiness className="h-[18px] w-[18px]" />}
            />
            <NavIconLink
              href="/blog"
              label="Blog"
              icon={<BookOpen className="h-[18px] w-[18px]" />}
            />
            <NavIconLink
              href="https://github.com/mahekara28"
              label="GitHub"
              external
              icon={<GitHubIcon />}
            />
            <NavIconLink
              href="https://www.linkedin.com/in/mahek-ara/"
              label="LinkedIn"
              external
              icon={<LinkedInIcon />}
            />
            <NavIconLink
              href="https://drive.google.com/file/d/1HB3XFQCsMgmZfF50zjjNN6900j-cZDok/view?usp=sharing"
              label="Resume"
              external
              icon={<FileText className="h-[18px] w-[18px]" />}
            />

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:scale-[1.03] ${
                isDark
                  ? "border-white/12 text-white/74 hover:border-emerald-400 hover:text-emerald-300"
                  : "border-black/12 text-black/68 hover:border-emerald-600 hover:text-emerald-700"
              }`}
            >
              {isDark ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-10 pt-8 sm:px-6 sm:pb-20 sm:pt-12 md:px-10 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.96fr)]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78 }}
            className="relative min-h-[calc(100svh-11.5rem)] max-w-[760px] pb-8 md:min-h-0 md:pb-0"
          >
            <div
              className={`flex min-h-[22px] items-center gap-3 text-[10px] uppercase tracking-[0.24em] sm:text-xs ${
                isDark ? "text-white/56" : "text-black/48"
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>AI Engineer</span>
              <span className={isDark ? "text-white/24" : "text-black/24"}>•</span>
              <span className="text-emerald-400">
                {typedStatus}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                  className="ml-1 inline-block"
                >
                  |
                </motion.span>
              </span>
            </div>

            <div className="mt-6">
              <h1 className="text-[clamp(4rem,19vw,9.6rem)] font-semibold leading-[0.84] tracking-[-0.08em]">
                <span className="block">{typedFirstName}</span>
                <span className="block text-emerald-400">{typedLastName}</span>
              </h1>
            </div>

            <div className="mt-7 flex max-w-[620px] items-start gap-4 sm:gap-5">
              <div className="mt-3 h-px w-10 shrink-0 bg-emerald-400/42 sm:w-14" />
              <div>
                <p
                  className={`text-[1.85rem] leading-none sm:text-[2.2rem] ${
                    isDark ? "text-white" : "text-[#121713]"
                  }`}
                >
                  AI Engineer
                </p>
                <p
                  className={`mt-5 max-w-[520px] text-base leading-8 sm:text-lg ${
                    isDark ? "text-white/58" : "text-black/54"
                  }`}
                >
                  {typedIntro}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="ml-1 inline-block"
                  >
                    |
                  </motion.span>
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/projects"
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-[#041108] transition duration-300 hover:scale-[1.02] hover:bg-emerald-300 sm:px-7 sm:text-[15px]"
              >
                Explore work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <a
                href="https://drive.google.com/file/d/1HB3XFQCsMgmZfF50zjjNN6900j-cZDok/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-14 items-center gap-2 rounded-full border px-6 text-sm transition duration-300 sm:px-7 sm:text-[15px] ${
                  isDark
                    ? "border-white/12 text-white/78 hover:border-emerald-400/34 hover:bg-emerald-400/8 hover:text-white"
                    : "border-black/10 text-black/76 hover:border-emerald-600/36 hover:bg-emerald-500/8 hover:text-black"
                }`}
              >
                <FileText className="h-4 w-4" />
                Resume
              </a>
            </div>

            <div className="pointer-events-none absolute right-[-2.1rem] top-[4.7rem] z-0 opacity-90 md:hidden">
              <div className="scale-[0.74] sm:scale-[0.82]">
                <McpFlowVisual dark={isDark} compact />
              </div>
            </div>
          </motion.div>

          <div className="hidden md:flex md:justify-end">
            <McpFlowVisual dark={isDark} />
          </div>
        </div>
      </section>

      <footer
        className={`relative z-10 border-t ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-4 py-4 text-[10px] uppercase tracking-[0.2em] sm:px-6 md:px-10 ${
            isDark ? "text-white/26" : "text-black/32"
          }`}
        >
          <span>© 2026 Mahek Ara</span>
          <span>AI / LLM / BUILD</span>
        </div>
      </footer>
    </main>
  );
}