"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "./theme-provider";

const statusPhrases = [
  "loading context",
  "mapping systems",
  "designing intelligence",
  "building in public",
];

function useTypedLoop(phrases: string[], typingSpeed = 70, pause = 1400) {
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

function useTypeOnce(value: string, speed = 45, delay = 0) {
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

function GitHubIcon({ className = "h-[17px] w-[17px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.61-5.48 5.91.43.38.81 1.12.81 2.26v3.35c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({
  className = "h-[17px] w-[17px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.5 8h4V24h-4V8Zm6.5 0h3.83v2.19h.05c.53-1.01 1.84-2.19 3.79-2.19C18.73 8 20 10.03 20 13.26V24h-4v-9.53c0-2.27-.04-5.19-3.16-5.19-3.16 0-3.64 2.47-3.64 5.02V24h-4V8Z" />
    </svg>
  );
}

function NavIconLink({
  href,
  label,
  children,
  external = false,
  isDark,
}: {
  href: string;
  label: string;
  children: ReactNode;
  external?: boolean;
  isDark: boolean;
}) {
  const classes = `group inline-flex h-10 items-center rounded-full border px-3 transition ${
    isDark
      ? "border-white/10 text-white/55 hover:border-emerald-400/35 hover:bg-emerald-400/10 hover:text-emerald-300"
      : "border-black/10 text-black/55 hover:border-emerald-600/25 hover:bg-emerald-500/8 hover:text-emerald-700"
  }`;

  const content = (
    <>
      <span className="flex h-4 w-4 items-center justify-center transition duration-300 group-hover:-rotate-12 group-hover:scale-95">
        {children}
      </span>
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[11px] uppercase tracking-[0.16em] opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[90px] group-hover:opacity-100">
        {label}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label} className={classes}>
      {content}
    </Link>
  );
}

function McpFlowVisual({
  isDark,
  compact = false,
}: {
  isDark: boolean;
  compact?: boolean;
}) {
  const lineColor = isDark ? "rgba(52,211,153,0.24)" : "rgba(16,185,129,0.22)";
  const softLineColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(15,20,17,0.10)";
  const chipBase = isDark
    ? "border-white/10 bg-[#08110b]/70 text-white/64"
    : "border-black/10 bg-white/70 text-black/58";
  const chipAccent = isDark
    ? "border-emerald-400/18 bg-emerald-400/[0.08] text-emerald-300/82"
    : "border-emerald-600/20 bg-emerald-500/[0.08] text-emerald-700/85";
  const ringOuter = isDark ? "border-white/8" : "border-black/10";
  const ringInner = isDark ? "border-emerald-400/16" : "border-emerald-700/16";
  const coreBorder = isDark ? "border-emerald-400/24" : "border-emerald-700/20";
  const coreBg = isDark ? "bg-emerald-400/8" : "bg-emerald-500/[0.06]";
  const nodeFill = isDark ? "rgba(52,211,153,0.9)" : "rgba(16,185,129,0.72)";
  const nodeGlow = isDark
    ? "0 0 20px rgba(52,211,153,0.24)"
    : "0 0 14px rgba(16,185,129,0.12)";

  const labels = [
    { text: "PROMPT", left: "8%", top: "22%", accent: false, delay: 0.1 },
    { text: "MCP TOOLS", left: "70%", top: "18%", accent: true, delay: 0.45 },
    { text: "MEMORY", left: "74%", top: "70%", accent: false, delay: 0.8 },
    { text: "RETRIEVAL", left: "10%", top: "74%", accent: false, delay: 1.1 },
    { text: "RESPONSE", left: "38%", top: "5%", accent: true, delay: 1.4 },
  ];

  const particles = [
    { left: "18%", top: "22%", delay: 0.1 },
    { left: "33%", top: "16%", delay: 0.5 },
    { left: "70%", top: "19%", delay: 0.9 },
    { left: "81%", top: "42%", delay: 0.2 },
    { left: "72%", top: "74%", delay: 1.2 },
    { left: "48%", top: "84%", delay: 0.7 },
    { left: "20%", top: "72%", delay: 1.4 },
    { left: "13%", top: "48%", delay: 1.0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: compact ? 0 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.12 }}
      className={`relative flex items-center justify-center ${
        compact
          ? "h-[320px] w-[320px]"
          : "h-[360px] w-full sm:h-[430px] md:h-[500px] lg:h-[560px]"
      }`}
    >
      <motion.div
        animate={{ scale: [0.96, 1.05, 0.96], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute rounded-full blur-[90px] ${
          compact
            ? "h-[220px] w-[220px]"
            : "h-[240px] w-[240px] sm:h-[320px] sm:w-[320px] md:h-[400px] md:w-[400px]"
        } ${isDark ? "bg-emerald-400/20" : "bg-emerald-500/10"}`}
      />

      <div className={`relative ${compact ? "h-full w-full" : "h-[92%] w-full max-w-[580px]"}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className={`absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border ${ringOuter}`}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed ${ringInner}`}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path d="M18 22 C32 22, 42 30, 50 50" stroke={lineColor} strokeWidth="0.36" fill="none" strokeDasharray="1.8 1.8" animate={{ pathLength: [0.14, 1, 0.14], opacity: [0.22, 0.84, 0.22] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M70 18 C62 28, 56 36, 50 50" stroke={lineColor} strokeWidth="0.36" fill="none" strokeDasharray="1.8 1.8" animate={{ pathLength: [0.16, 1, 0.16], opacity: [0.22, 0.82, 0.22] }} transition={{ duration: 4.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M74 70 C66 64, 58 58, 50 50" stroke={lineColor} strokeWidth="0.34" fill="none" strokeDasharray="1.8 1.8" animate={{ pathLength: [0.16, 1, 0.16], opacity: [0.18, 0.8, 0.18] }} transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M20 72 C28 64, 38 58, 50 50" stroke={lineColor} strokeWidth="0.34" fill="none" strokeDasharray="1.8 1.8" animate={{ pathLength: [0.18, 1, 0.18], opacity: [0.18, 0.78, 0.18] }} transition={{ duration: 4.6, delay: 0.8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M50 50 C50 38, 46 22, 40 8" stroke={lineColor} strokeWidth="0.38" fill="none" strokeDasharray="2 2" animate={{ pathLength: [0.14, 1, 0.14], opacity: [0.24, 0.95, 0.24] }} transition={{ duration: 3.8, delay: 0.45, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M18 22 C46 20, 62 18, 70 18" stroke={softLineColor} strokeWidth="0.22" fill="none" strokeDasharray="1 2" animate={{ opacity: [0.08, 0.2, 0.08] }} transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M20 72 C48 84, 66 82, 74 70" stroke={softLineColor} strokeWidth="0.22" fill="none" strokeDasharray="1 2" animate={{ opacity: [0.08, 0.18, 0.08] }} transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }} />
        </svg>

        <motion.div
          animate={{ scale: [0.97, 1.05, 0.97], opacity: [0.78, 1, 0.78] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border sm:h-28 sm:w-28 md:h-32 md:w-32 ${coreBorder} ${coreBg} ${compact ? "sm:h-20 sm:w-20 md:h-20 md:w-20" : ""}`}
        >
          <div className={`absolute inset-3 rounded-full border ${isDark ? "border-emerald-400/16" : "border-emerald-700/14"}`} />
          <div className={`absolute inset-6 rounded-full border ${isDark ? "border-emerald-400/10" : "border-emerald-700/10"}`} />
          <div className="text-center">
            <div className={`uppercase tracking-[0.26em] ${isDark ? "text-white/34" : "text-black/36"} ${compact ? "text-[7px]" : "text-[8px]"}`}>
              agent
            </div>
            <div className={`mt-2 uppercase tracking-[0.28em] ${isDark ? "text-emerald-300/78" : "text-emerald-700/82"} ${compact ? "text-[9px]" : "text-[10px]"}`}>
              router
            </div>
          </div>
        </motion.div>

        {labels.map((label, index) => {
          if (compact && index > 2) return null;

          return (
            <motion.div
              key={label.text}
              animate={{
                y: [0, -6, 0],
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                duration: 3.6,
                delay: label.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute rounded-full border px-3 py-2 uppercase tracking-[0.16em] ${
                label.accent ? chipAccent : chipBase
              } ${compact ? "text-[9px]" : "text-[10px]"}`}
              style={{ left: label.left, top: label.top }}
            >
              {label.text}
            </motion.div>
          );
        })}

        {particles.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.92, 0.2],
              scale: [0.9, 1.18, 0.9],
            }}
            transition={{
              duration: 3.4,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`${compact ? "h-1.5 w-1.5" : "h-2 w-2"} absolute rounded-full`}
            style={{
              left: particle.left,
              top: particle.top,
              backgroundColor: nodeFill,
              boxShadow: nodeGlow,
            }}
          />
        ))}

        {!compact && (
          <div
            className={`absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.28em] ${
              isDark ? "text-white/26" : "text-black/32"
            }`}
          >
            prompt • tools • memory • response
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const typedStatus = useTypedLoop(statusPhrases, 58, 1100);
  const typedFirstName = useTypeOnce("MAHEK", 70, 120);
  const typedLastName = useTypeOnce("ARA", 70, 520);
  const typedIntro = useTypeOnce(
    "Building practical AI systems with LLMs, agents, automation and AI security.",
    18,
    760,
  );

  const mobileSkills = [
    { label: "LLM Systems", span: "col-span-2" },
    { label: "Agent Workflows", span: "col-span-1" },
    { label: "AI Security", span: "col-span-1" },
  ];

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        isDark ? "bg-[#060806] text-white" : "bg-[#f4f7f2] text-[#0f1411]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -right-40 top-20 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
          }`}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[130px] ${
            isDark ? "bg-emerald-400/10" : "bg-emerald-400/8"
          }`}
        />
      </div>

      <header
        className={`relative z-50 mx-auto flex min-h-[72px] w-full max-w-[1450px] items-center justify-between border-b px-4 sm:min-h-[78px] sm:px-6 md:min-h-[84px] md:px-10 ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <Link href="/" className={isDark ? "text-white" : "text-black"}>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tracking-[0.12em] transition sm:h-11 sm:w-11 sm:text-xs ${
              isDark
                ? "border-white/20 hover:border-emerald-400"
                : "border-black/15 hover:border-emerald-600"
            }`}
          >
            MA
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <NavIconLink href="/projects" label="Work" isDark={isDark}>
            <Briefcase className="h-[17px] w-[17px]" />
          </NavIconLink>

          <NavIconLink href="/blog" label="Blog" isDark={isDark}>
            <BookOpen className="h-[17px] w-[17px]" />
          </NavIconLink>

          <NavIconLink href="https://github.com/mahekara28" label="GitHub" external isDark={isDark}>
            <GitHubIcon />
          </NavIconLink>

          <NavIconLink href="https://www.linkedin.com/in/mahek-ara/" label="LinkedIn" external isDark={isDark}>
            <LinkedInIcon />
          </NavIconLink>

          <NavIconLink
            href="https://drive.google.com/file/d/1HB3XFQCsMgmZfF50zjjNN6900j-cZDok/view?usp=sharing"
            label="Resume"
            external
            isDark={isDark}
          >
            <FileText className="h-[17px] w-[17px]" />
          </NavIconLink>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-white/15 text-white/55 hover:border-emerald-400 hover:text-emerald-300"
                : "border-black/15 text-black/55 hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-[1450px] overflow-hidden px-4 py-10 sm:px-6 sm:py-12 md:min-h-[calc(100vh-140px)] md:px-10 md:py-6 lg:items-center">
        <div className="pointer-events-none absolute right-[-90px] top-[110px] z-0 opacity-80 lg:hidden">
          <div className="scale-[0.78] sm:scale-[0.88]">
            <McpFlowVisual isDark={isDark} compact />
          </div>
        </div>

        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 max-w-[720px] pr-20 sm:pr-28 lg:pr-0"
          >
            <div
              className={`mb-6 flex min-h-[20px] items-center gap-2 text-[10px] uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.22em] ${
                isDark ? "text-white/55" : "text-black/55"
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span>AI Engineer</span>
              <span className={isDark ? "opacity-40" : "opacity-30"}>·</span>
              <span className={isDark ? "text-emerald-400/90" : "text-emerald-700/90"}>
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

            <h1
              className={`font-black leading-[0.86] tracking-[-0.08em] ${
                isDark ? "text-white" : "text-[#0f1411]"
              }`}
            >
              <span className="block text-[clamp(4.1rem,18vw,11rem)]">{typedFirstName}</span>
              <span className={isDark ? "block text-[clamp(4.1rem,18vw,11rem)] text-emerald-400" : "block text-[clamp(4.1rem,18vw,11rem)] text-emerald-700"}>
                {typedLastName}
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span
                className={`h-px w-10 shrink-0 sm:w-14 ${
                  isDark ? "bg-white/30" : "bg-black/20"
                }`}
              />
              <p className={isDark ? "text-sm font-medium tracking-wide text-white sm:text-base md:text-lg" : "text-sm font-medium tracking-wide text-[#0f1411] sm:text-base md:text-lg"}>
                AI Engineer
              </p>
            </div>

            <p
              className={`mt-5 max-w-[560px] text-sm leading-7 sm:text-base sm:leading-8 ${
                isDark ? "text-white/52" : "text-black/62"
              }`}
            >
              {typedIntro}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.85, repeat: Infinity }}
                className="ml-1 inline-block"
              >
                |
              </motion.span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group flex h-12 items-center gap-2 rounded-full bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:bg-emerald-300 sm:h-14 sm:px-6"
              >
                Explore work
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <a
                href="https://drive.google.com/file/d/1HB3XFQCsMgmZfF50zjjNN6900j-cZDok/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className={`flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition sm:h-14 sm:px-6 ${
                  isDark
                    ? "border-white/15 text-white/80 hover:border-white/40"
                    : "border-black/15 text-black/75 hover:border-black/30"
                }`}
              >
                <FileText size={15} />
                Resume
              </a>
            </div>

            <div className="mt-9 sm:hidden">
              <div className="grid grid-cols-2 gap-3">
                {mobileSkills.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.55 + index * 0.08 }}
                    className={`${item.span} rounded-[22px] border px-4 py-4 text-center ${
                      isDark
                        ? "border-white/8 bg-white/[0.03]"
                        : "border-black/8 bg-black/[0.02]"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-[0.18em] ${
                        isDark ? "text-white/34" : "text-black/46"
                      }`}
                    >
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-9 hidden max-w-[560px] sm:grid sm:grid-cols-3 sm:gap-3">
              {["LLM systems", "Agent workflows", "AI security"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.55 + index * 0.08 }}
                  className={`rounded-full border px-4 py-3 text-center text-[11px] uppercase tracking-[0.18em] ${
                    isDark
                      ? "border-white/8 bg-white/[0.02] text-white/34"
                      : "border-black/8 bg-black/[0.02] text-black/45"
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <McpFlowVisual isDark={isDark} />
          </div>
        </div>
      </section>

      <footer
        className={`relative z-20 mx-auto flex w-full max-w-[1450px] items-center justify-between border-t px-4 py-4 text-[9px] uppercase tracking-[0.14em] sm:px-6 sm:text-[10px] sm:tracking-[0.18em] md:px-10 md:py-5 md:text-[11px] ${
          isDark ? "border-white/10 text-white/30" : "border-black/10 text-black/35"
        }`}
      >
        <span>© 2026 Mahek Ara</span>
        <span>AI / LLM / BUILD</span>
      </footer>
    </main>
  );
}