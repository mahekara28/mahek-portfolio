"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Radar,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useTheme } from "../theme-provider";

const projects = [
  {
    number: "01",
    title: "LLM Router",
    description:
      "A routing layer that decides which model should answer based on complexity, latency tolerance and context needs.",
    stack: ["Python", "FastAPI", "Ollama", "LLMs"],
    github: "https://github.com/mahekara28/LLM---Router",
    type: "Systems",
    note: "Dynamic routing for quality, speed and cost balance.",
    icon: BriefcaseBusiness,
  },
  {
    number: "02",
    title: "Prompt Injection Lab",
    description:
      "A controlled environment for probing prompt injection risks, evaluating model behavior and documenting failure modes.",
    stack: ["Python", "FastAPI", "Security", "Eval"],
    github: "https://github.com/mahekara28/Prompt-Injection-Lab",
    type: "Security",
    note: "Adversarial testing for safer AI behavior.",
    icon: Shield,
  },
  {
    number: "03",
    title: "KnowWhen AI",
    description:
      "An intelligent planning workflow designed to make AI responses feel more aware of timing, context and actionability.",
    stack: ["OpenAI", "Automation", "Python", "Agents"],
    github: "https://github.com/mahekara28/knowwhen-ai",
    type: "Automation",
    note: "Planning around context, availability and goals.",
    icon: Workflow,
  },
  {
    number: "04",
    title: "MCP Impact",
    description:
      "A change-impact simulator for MCP servers that traces what could break across prompts, workflows, agents and evals before updates ship.",
    stack: ["JavaScript", "MCP", "GitHub", "Dev Tools"],
    github: "https://github.com/mahekara28/mcp-impact",
    type: "AI Tooling",
    note: "Change-impact analysis for MCP systems.",
    icon: Radar,
  },
  {
    number: "05",
    title: "Narrative Gap MCP",
    description:
      "A GitHub-backed review surface for finding where docs, messaging and developer experience drift away from what users actually encounter.",
    stack: ["JavaScript", "MCP", "DevRel", "GitHub Signals"],
    github: "https://github.com/mahekara28/Narrative-Gap-MCP",
    type: "Product Signal",
    note: "Connecting product narrative with developer reality.",
    icon: Sparkles,
  },
  {
    number: "06",
    title: "Insightify",
    description:
      "A lightweight analytics app built to turn raw inputs into clearer patterns, concise summaries and more decision-friendly insight.",
    stack: ["Python", "Streamlit", "GenAI", "Analytics"],
    github: "https://github.com/mahekara28/Insightify",
    type: "Data",
    note: "Turning raw data into usable insight.",
    icon: BarChart3,
  },
];

export default function Projects() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#140d10] text-[#f5e9df]" : "bg-[#f3e9df] text-[#24181a]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -right-40 top-20 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? "bg-[#8b4652]/14" : "bg-[#d9b7a8]/18"
          }`}
        />
        <div
          className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[130px] ${
            isDark ? "bg-[#c78f97]/10" : "bg-[#f1d9ca]/18"
          }`}
        />
      </div>

      <header
        className={`relative z-20 border-b ${
          isDark ? "border-[#d4b29f]/10" : "border-black/10"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 md:h-[82px] md:px-10">
          <Link href="/" className="group flex items-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition ${
                isDark
                  ? "border-[#d4b29f]/18 text-[#f5e9df] group-hover:border-[#d4b29f]/36 group-hover:text-white"
                  : "border-[#7e3f4c]/14 text-[#2a1f21] group-hover:border-[#8b4652]/28 group-hover:text-[#8b4652]"
              }`}
            >
              MA
            </span>
          </Link>

          <Link
            href="/"
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition sm:text-sm ${
              isDark
                ? "border-[#d4b29f]/12 text-[#efe1d6]/56 hover:border-[#d4b29f]/26 hover:bg-white/[0.03] hover:text-white"
                : "border-[#7e3f4c]/10 text-black/52 hover:border-[#8b4652]/22 hover:bg-[#8b4652]/[0.05] hover:text-[#2a1f21]"
            }`}
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-14 pt-14 sm:px-6 md:px-10 md:pb-20 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] sm:text-xs ${
              isDark ? "text-[#d4b29f]/82" : "text-[#9a5a66]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isDark
                  ? "bg-[#d4b29f] shadow-[0_0_12px_3px_rgba(212,178,159,0.22)]"
                  : "bg-[#b88388] shadow-[0_0_12px_3px_rgba(184,131,136,0.2)]"
              }`}
            />
            Selected work
          </div>

          <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
            Projects that turn
            <br />
            <span className={isDark ? "text-[#d9c1b4]/44" : "text-[#8b4652]"}>
              ideas into durable systems.
            </span>
          </h1>

          <div className="mt-6 flex max-w-3xl items-start gap-4">
            <div
              className={`mt-3 h-px w-12 shrink-0 ${
                isDark ? "bg-[#d4b29f]/46" : "bg-[#8b4652]/50"
              }`}
            />

            <p
              className={`text-sm leading-7 sm:text-base ${
                isDark ? "text-[#efe1d6]/54" : "text-black/58"
              }`}
            >
              These projects reflect the kind of work I care about most:
              systems that hold up under real use, stay readable as they grow,
              and turn technical depth into something clear, useful and worth
              shipping.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <motion.article
                key={project.number}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className={`group relative overflow-hidden rounded-[30px] border p-6 ${
                  isDark
                    ? "border-[#d4b29f]/10 bg-white/[0.025]"
                    : "border-[#7e3f4c]/10 bg-white/50"
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 ${
                    isDark
                      ? "bg-[radial-gradient(circle_at_top_right,rgba(199,143,151,0.12),transparent_40%)]"
                      : "bg-[radial-gradient(circle_at_top_right,rgba(184,131,136,0.14),transparent_40%)]"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100 ${
                    isDark ? "via-[#d4b29f]/40" : "via-[#8b4652]/28"
                  }`}
                />

                <div className="relative flex h-full min-h-[360px] flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`font-mono text-xs ${
                        isDark ? "text-[#efe1d6]/24" : "text-black/28"
                      }`}
                    >
                      {project.number}
                    </span>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                        isDark
                          ? "border-[#d4b29f]/10 text-[#efe1d6]/48 hover:border-[#d4b29f]/24 hover:text-[#f5e9df]"
                          : "border-[#7e3f4c]/10 text-black/42 hover:border-[#8b4652]/18 hover:text-[#8b4652]"
                      }`}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                        isDark
                          ? "border-[#d4b29f]/14 text-[#d4b29f]/82"
                          : "border-[#8b4652]/14 text-[#8b4652]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                        isDark
                          ? "border-[#d4b29f]/16 bg-[#d4b29f]/[0.06] text-[#e6cfc1]"
                          : "border-[#8b4652]/12 bg-[#8b4652]/[0.06] text-[#8b4652]"
                      }`}
                    >
                      {project.type}
                    </span>
                  </div>

                  <h2 className="mt-8 text-3xl font-medium tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                    {project.title}
                  </h2>

                  <div
                    className={`mt-4 text-[10px] uppercase tracking-[0.2em] sm:text-xs ${
                      isDark ? "text-[#d4b29f]/82" : "text-[#b46b76]"
                    }`}
                  >
                    {project.note}
                  </div>

                  <p
                    className={`mt-7 text-sm leading-7 transition-colors duration-300 sm:text-base ${
                      isDark
                        ? "text-[#efe1d6]/56 group-hover:text-[#efe1d6]/74"
                        : "text-black/60 group-hover:text-black/74"
                    }`}
                  >
                    {project.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition duration-300 ${
                          isDark
                            ? "border-[#d4b29f]/10 text-[#efe1d6]/34 group-hover:border-[#d4b29f]/18 group-hover:text-[#d4b29f]/82"
                            : "border-[#7e3f4c]/10 text-black/38 group-hover:border-[#8b4652]/18 group-hover:text-[#8b4652]"
                        }`}
                      >
                        {tech}
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