"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Shield,
  Workflow,
} from "lucide-react";
import { useTheme } from "../theme-provider";

const projects = [
  {
    id: "01",
    title: "LLM Router",
    category: "Systems",
    icon: Bot,
    tagline: "Dynamic routing for quality, speed and cost balance.",
    description:
      "A routing layer that decides which model should answer based on complexity, latency tolerance and context needs.",
    stack: ["Python", "FastAPI", "Ollama", "LLMs"],
    href: "#",
  },
  {
    id: "02",
    title: "Prompt Injection Lab",
    category: "Security",
    icon: Shield,
    tagline: "Adversarial testing for safer AI behavior.",
    description:
      "A controlled environment for probing prompt injection risks, evaluating model behavior and documenting failure modes.",
    stack: ["Python", "FastAPI", "Security", "Eval"],
    href: "#",
  },
  {
    id: "03",
    title: "KnowWhen AI",
    category: "Automation",
    icon: Workflow,
    tagline: "Planning around context, availability and goals.",
    description:
      "An intelligent planning workflow designed to make AI responses feel more aware of timing, context and actionability.",
    stack: ["OpenAI", "Automation", "Python", "Agents"],
    href: "#",
  },
];

export default function ProjectsPage() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-[#140d10] text-[#efe1d6]" : "bg-[#f3e9df] text-[#24181a]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-[320px] w-[320px] rounded-full bg-[#5a4558]/18 blur-[130px]" />
        <div className="absolute -right-44 top-16 h-[420px] w-[420px] rounded-full bg-[#6f2f3d]/22 blur-[130px]" />
        <div className="absolute -left-36 bottom-0 h-[320px] w-[320px] rounded-full bg-[#4f3946]/18 blur-[120px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(126,63,76,0.13),transparent_34%),radial-gradient(circle_at_top_right,rgba(212,178,159,0.04),transparent_28%)]" />

      <header
        className={`relative z-20 border-b ${
          isDark ? "border-[#d4b29f]/10" : "border-black/10"
        }`}
      >
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 py-5 sm:px-6 md:px-10">
          <Link href="/" className="flex items-center">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[12px] font-semibold tracking-[0.12em] transition ${
                isDark
                  ? "border-[#d4b29f]/18 text-[#efe1d6] hover:border-[#d4b29f]/34"
                  : "border-[#7e3f4c]/16 text-[#24181a] hover:border-[#7e3f4c]/32"
              }`}
            >
              MA
            </span>
          </Link>

          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              isDark
                ? "border-[#d4b29f]/12 text-[#efe1d6]/76 hover:border-[#d4b29f]/28 hover:text-[#f5e7db]"
                : "border-[#7e3f4c]/12 text-black/70 hover:border-[#7e3f4c]/28 hover:text-[#7e3f4c]"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-10 pt-10 sm:px-6 sm:pt-14 md:px-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[860px]"
        >
          <div
            className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] sm:text-xs ${
              isDark ? "text-[#efe1d6]/56" : "text-black/48"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#d4b29f]" />
            <span>Selected Work</span>
          </div>

          <h1 className="mt-6 text-[clamp(3rem,8vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
            Projects that turn
            <br />
            <span className={isDark ? "text-[#b88388]" : "text-[#8b4652]"}>
              AI into product signal.
            </span>
          </h1>

          <p
            className={`mt-6 max-w-[700px] text-base leading-8 sm:text-lg ${
              isDark ? "text-[#efe1d6]/62" : "text-black/58"
            }`}
          >
            A few things I’ve built across LLM systems, automation and AI
            security. I like work that sits at the intersection of technical
            depth, usability and clear product thinking.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-16 sm:px-6 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 + index * 0.08 }}
                className={`group relative overflow-hidden rounded-[30px] border p-6 ${
                  isDark
                    ? "border-[#d4b29f]/10 bg-[#1a1115]/88"
                    : "border-[#7e3f4c]/10 bg-white/70"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(126,63,76,0.12),transparent_30%)] opacity-80" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-[11px] uppercase tracking-[0.22em] ${
                          isDark ? "text-[#efe1d6]/34" : "text-black/36"
                        }`}
                      >
                        {project.id}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                            isDark
                              ? "border-[#d4b29f]/12 bg-[#8b4652]/12"
                              : "border-[#7e3f4c]/12 bg-[#8b4652]/8"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-[#b88388]" />
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                            isDark
                              ? "border-[#d4b29f]/10 text-[#d4b29f]"
                              : "border-[#7e3f4c]/10 text-[#7e3f4c]"
                          }`}
                        >
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <a
                      href={project.href}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                        isDark
                          ? "border-[#d4b29f]/10 text-[#efe1d6]/66 hover:border-[#d4b29f]/30 hover:text-[#f5e7db]"
                          : "border-[#7e3f4c]/10 text-black/60 hover:border-[#7e3f4c]/28 hover:text-[#7e3f4c]"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>

                  <h2 className="mt-8 text-[2rem] font-semibold leading-tight tracking-[-0.04em]">
                    {project.title}
                  </h2>

                  <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[#b88388]">
                    {project.tagline}
                  </p>

                  <p
                    className={`mt-6 text-[15px] leading-7 ${
                      isDark ? "text-[#efe1d6]/62" : "text-black/58"
                    }`}
                  >
                    {project.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] ${
                          isDark
                            ? "border-[#d4b29f]/10 bg-white/[0.02] text-[#efe1d6]/58"
                            : "border-[#7e3f4c]/10 bg-white/60 text-black/52"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}