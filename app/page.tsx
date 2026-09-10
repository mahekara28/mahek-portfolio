"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  FileText,
  GitBranch,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [dark, setDark] = useState(true);

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        dark
          ? "bg-[#060806] text-white"
          : "bg-[#f5f7f4] text-[#101310]"
      }`}
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.18, 0.28, 0.18],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[130px]"
        />
      </div>

      {/* NAVBAR */}
      <header className="relative z-50 mx-auto flex min-h-[68px] w-full max-w-[1450px] items-center justify-between border-b border-white/10 px-4 sm:px-6 md:h-[76px] md:px-10">
        {/* Logo */}
        <Link
          href="/"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold tracking-tight transition ${
            dark
              ? "border-white/20 text-white hover:border-emerald-400"
              : "border-black/15 text-black hover:border-emerald-500"
          }`}
        >
          MA
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 text-xs sm:gap-5 sm:text-sm md:gap-7 md:text-sm">
          <Link
            href="/projects"
            className="opacity-60 transition hover:text-emerald-400 hover:opacity-100"
          >
            Work
          </Link>

          <Link
            href="/blog"
            className="opacity-60 transition hover:text-emerald-400 hover:opacity-100"
          >
            Blog
          </Link>

          <a
            href="https://github.com/mahekara28"
            target="_blank"
            rel="noreferrer"
            className="opacity-60 transition hover:text-emerald-400 hover:opacity-100"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/mahek-ara/"
            target="_blank"
            rel="noreferrer"
            className="opacity-60 transition hover:text-emerald-400 hover:opacity-100"
          >
            LinkedIn
          </a>

          <a
            href="https://drive.google.com/file/d/1HB3XFQCsMgmZfF50zjjNN6900j-cZDok/view?usp=sharing"
            target="_blank"
            className="hidden items-center gap-1 opacity-60 transition hover:text-emerald-400 hover:opacity-100 md:flex"
          >
            Resume
            <ArrowUpRight size={13} />
          </a>

          {/* Theme */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
              dark
                ? "border-white/15 hover:border-emerald-400"
                : "border-black/15 hover:border-emerald-500"
            }`}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1450px] px-4 py-8 sm:px-6 md:min-h-[calc(100vh-126px)] md:items-center md:px-10 md:py-2">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            {/* Status */}
            <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] opacity-50 sm:text-xs sm:tracking-[0.22em]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              AI Engineer · Building in public
            </div>

            {/* Name */}
            <h1 className="font-black tracking-[-0.075em] leading-[0.78]">
              <span className="block text-[clamp(4rem,18vw,10.5rem)]">
                MAHEK
              </span>

              <span className="mt-3 block text-[clamp(4rem,18vw,10.5rem)] text-emerald-400">
                ARA
              </span>
            </h1>

            {/* Role */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className={`h-px w-8 shrink-0 sm:w-10 ${
                  dark ? "bg-white/30" : "bg-black/20"
                }`}
              />

              <p className="text-sm font-medium tracking-wide sm:text-base md:text-lg">
                AI Engineer
              </p>
            </div>

            {/* Tiny intro */}
            <p
              className={`mt-4 max-w-md text-sm leading-6 sm:text-base ${
                dark ? "text-white/50" : "text-black/55"
              }`}
            >
              Building practical AI systems with LLMs, agents,
              automation and AI security.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 sm:px-5"
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
                className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition sm:px-5 ${
                  dark
                    ? "border-white/15 hover:border-white/40"
                    : "border-black/15 hover:border-black/30"
                }`}
              >
                <FileText size={15} />
                Resume
              </a>
            </div>
          </motion.div>

          {/* RIGHT — LLM ATTENTION VISUALIZATION */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="relative flex h-[380px] w-full items-center justify-center sm:h-[430px] md:h-[460px] lg:h-[520px] lg:-ml-4"
          >
            {/* Ambient glow */}
            <motion.div
              animate={{
                scale: [0.9, 1.08, 0.9],
                opacity: [0.12, 0.22, 0.12],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-emerald-400/20 blur-[80px] sm:h-[280px] sm:w-[280px] sm:blur-[100px] md:h-[340px] md:w-[340px] md:blur-[110px]"
            />

            {/* Neural field */}
            <div className="relative h-[330px] w-full max-w-[560px] sm:h-[380px] md:h-[400px] lg:h-[430px]">

              {/* Connecting lines */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 560 430"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                {/* Input → Attention */}
                <motion.path
                  d="M70 120 C180 80 190 160 280 210"
                  stroke="rgba(52,211,153,0.22)"
                  strokeWidth="1"
                  strokeDasharray="5 8"
                  animate={{
                    strokeDashoffset: [0, -80],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.path
                  d="M70 215 C170 190 210 210 280 215"
                  stroke="rgba(52,211,153,0.35)"
                  strokeWidth="1"
                  strokeDasharray="5 8"
                  animate={{
                    strokeDashoffset: [0, -80],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.path
                  d="M70 310 C180 350 210 270 280 220"
                  stroke="rgba(52,211,153,0.2)"
                  strokeWidth="1"
                  strokeDasharray="5 8"
                  animate={{
                    strokeDashoffset: [0, -80],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Attention → Representation */}
                <motion.path
                  d="M280 215 C355 170 385 145 455 135"
                  stroke="rgba(52,211,153,0.4)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  animate={{
                    strokeDashoffset: [0, -70],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.path
                  d="M280 215 C360 215 390 215 470 215"
                  stroke="rgba(52,211,153,0.55)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  animate={{
                    strokeDashoffset: [0, -70],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.path
                  d="M280 215 C355 260 385 290 455 300"
                  stroke="rgba(52,211,153,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  animate={{
                    strokeDashoffset: [0, -70],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Output flow */}
                <motion.path
                  d="M455 135 C500 155 505 190 500 215"
                  stroke="rgba(52,211,153,0.25)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                  animate={{
                    strokeDashoffset: [0, -50],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.path
                  d="M470 215 C505 225 505 260 455 300"
                  stroke="rgba(52,211,153,0.25)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                  animate={{
                    strokeDashoffset: [0, -50],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>

              {/* INPUT TOKENS */}
              <div className="absolute left-0 top-[50px] space-y-5 sm:top-[60px] sm:space-y-6 md:top-[70px] md:space-y-7">
                {["The", "model", "predicts"].map((token, i) => (
                  <motion.div
                    key={token}
                    animate={{
                      x: [0, 7, 0],
                      opacity: [0.45, 0.8, 0.45],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                    className="font-mono text-[10px] tracking-wider text-white/45 sm:text-xs"
                  >
                    <span className="mr-1.5 text-emerald-400/70 sm:mr-2">
                      0{i + 1}
                    </span>

                    {token}
                  </motion.div>
                ))}
              </div>

              {/* CENTRAL ATTENTION CORE */}
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[105px] sm:w-[105px] md:h-[120px] md:w-[120px]"
              >
                {/* Outer ring */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border border-emerald-400/20"
                />

                {/* Second ring */}
                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-3 rounded-full border border-emerald-400/10 sm:-inset-4"
                />

                {/* Core glow */}
                <div className="absolute h-16 w-16 rounded-full bg-emerald-400/10 blur-xl sm:h-20 sm:w-20 sm:blur-2xl" />

                {/* Core */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-[#060806]/80 shadow-[0_0_50px_rgba(52,211,153,0.18)] backdrop-blur-sm sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <motion.div
                    animate={{
                      scale: [0.8, 1.15, 0.8],
                      opacity: [0.4, 0.9, 0.4],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_8px_rgba(52,211,153,0.4)] sm:h-3 sm:w-3"
                  />
                </div>
              </motion.div>

              {/* ATTENTION LABEL */}
              <div className="absolute left-1/2 top-[calc(50%+65px)] -translate-x-1/2 text-center sm:top-[calc(50%+72px)] md:top-[calc(50%+82px)]">
                <div className="whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-400/70 sm:text-[9px] md:text-[10px] md:tracking-[0.28em]">
                  Self-Attention
                </div>

                <div className="mt-1 font-mono text-[8px] tracking-wider text-white/25 sm:text-[9px]">
                  Q · K · V
                </div>
              </div>

              {/* LATENT NODES */}
              <div className="absolute right-0 top-[50px] space-y-5 sm:top-[60px] sm:space-y-6 md:top-[70px] md:space-y-7">
                {[
                  {
                    label: "context",
                    value: "0.82",
                  },
                  {
                    label: "semantic",
                    value: "0.94",
                  },
                  {
                    label: "next token",
                    value: "0.71",
                  },
                ].map((node, i) => (
                  <motion.div
                    key={node.label}
                    animate={{
                      y: [0, -4, 0],
                      opacity: [0.45, 0.85, 0.45],
                    }}
                    transition={{
                      duration: 3.5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="text-right">
                      <div className="font-mono text-[8px] uppercase tracking-wider text-white/45 sm:text-[9px] md:text-[10px]">
                        {node.label}
                      </div>

                      <div className="mt-1 whitespace-nowrap font-mono text-[7px] text-emerald-400/50 sm:text-[8px] md:text-[9px]">
                        attention {node.value}
                      </div>
                    </div>

                    <motion.span
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_4px_rgba(52,211,153,0.25)] sm:h-2 sm:w-2"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Technical annotation */}
              <div className="absolute left-[18%] top-0 font-mono text-[7px] uppercase tracking-[0.18em] text-white/20 sm:text-[8px] sm:tracking-[0.22em] md:text-[9px] md:tracking-[0.25em]">
                Transformer layer 08
              </div>

              {/* Bottom annotation */}
              <motion.div
                animate={{
                  opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] uppercase tracking-[0.18em] text-emerald-400/40 sm:text-[8px] sm:tracking-[0.24em] md:text-[9px] md:tracking-[0.3em]"
              >
                latent representation → generation
              </motion.div>

              {/* Floating particles */}
              {[
                {
                  left: "30%",
                  top: "15%",
                  delay: 0,
                },
                {
                  left: "42%",
                  top: "78%",
                  delay: 1,
                },
                {
                  left: "67%",
                  top: "8%",
                  delay: 1.8,
                },
                {
                  left: "78%",
                  top: "70%",
                  delay: 0.7,
                },
                {
                  left: "17%",
                  top: "78%",
                  delay: 2,
                },
              ].map((particle, i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.15, 0.5, 0.15],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: particle.delay,
                  }}
                  className="absolute h-1 w-1 rounded-full bg-emerald-300"
                  style={{
                    left: particle.left,
                    top: particle.top,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`relative z-20 mx-auto flex w-full max-w-[1450px] items-center justify-between border-t px-4 py-4 text-[9px] uppercase tracking-[0.14em] sm:px-6 sm:text-[10px] sm:tracking-[0.18em] md:px-10 md:py-5 md:text-[11px] ${
          dark
            ? "border-white/10 text-white/30"
            : "border-black/10 text-black/30"
        }`}
      >
        <span>© 2026 Mahek Ara</span>

        <div className="flex items-center gap-2 sm:gap-4">
          <span>AI / LLM / BUILD</span>
          <GitBranch size={13} />
        </div>
      </footer>
    </main>
  );
}