"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { useTheme } from "../theme-provider";

const projects = [
  {
    number: "01",
    title: "LLM Router",
    description:
      "Intelligent model routing based on request complexity, capability and latency.",
    stack: ["Python", "Ollama", "LLMs", "FastAPI"],
    github: "https://github.com/mahekara28/LLM---Router",
    type: "Systems",
    note: "Dynamic routing for quality and speed",
  },
  {
    number: "02",
    title: "Prompt Injection Lab",
    description:
      "A controlled environment for testing adversarial prompts and LLM security behavior.",
    stack: ["Python", "LLM Security", "FastAPI"],
    github: "https://github.com/mahekara28/Prompt-Injection-Lab",
    type: "Security",
    note: "Adversarial testing and evaluation",
  },
  {
    number: "03",
    title: "KnowWhen AI",
    description:
      "An intelligent planning system designed around context, availability and goals.",
    stack: ["Python", "OpenAI", "AI Automation"],
    github: "https://github.com/mahekara28/knowwhen-ai",
    type: "Automation",
    note: "Planning around real-world context",
  },
];

export default function Projects() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#060806] text-white" : "bg-[#f4f7f2] text-[#0f1411]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -right-40 top-20 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? "bg-emerald-500/[0.07]" : "bg-emerald-500/[0.10]"
          }`}
        />
        <div
          className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[130px] ${
            isDark ? "bg-emerald-400/[0.05]" : "bg-emerald-400/[0.08]"
          }`}
        />
      </div>

      <header
        className={`relative z-20 border-b ${
          isDark ? "border-white/[0.08]" : "border-black/[0.08]"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 md:h-[82px] md:px-10">
          <Link href="/" className="group flex items-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition ${
                isDark
                  ? "border-white/15 text-white group-hover:border-emerald-400 group-hover:text-emerald-400"
                  : "border-black/15 text-[#0f1411] group-hover:border-emerald-600 group-hover:text-emerald-700"
              }`}
            >
              MA
            </span>
          </Link>

          <Link
            href="/"
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition sm:text-sm ${
              isDark
                ? "border-white/10 text-white/45 hover:border-emerald-400/35 hover:bg-emerald-400/10 hover:text-white"
                : "border-black/10 text-black/45 hover:border-emerald-600/25 hover:bg-emerald-500/8 hover:text-[#0f1411]"
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] sm:text-xs ${
                isDark ? "text-emerald-400/80" : "text-emerald-700/85"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.35)]" />
              Selected work
            </div>

            <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
              Selected
              <br />
              <span className={isDark ? "text-white/35" : "text-black/35"}>
                projects.
              </span>
            </h1>

            <div className="mt-6 flex max-w-2xl items-start gap-4">
              <div className="mt-3 h-px w-12 shrink-0 bg-emerald-400/50" />
              <p
                className={`text-sm leading-7 sm:text-base ${
                  isDark ? "text-white/46" : "text-black/58"
                }`}
              >
                A focused collection of AI systems, experiments and
                product-thinking work, presented in a cleaner case-study grid
                for faster scanning and a stronger first impression.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
          >
            <InfoCard
              isDark={isDark}
              label="Built for"
              title="Real AI use cases"
              body="Systems designed around actual prompts, workflows and user needs."
            />
            <InfoCard
              isDark={isDark}
              label="Perspective"
              title="Product x security x DX"
              body="Work shaped by usefulness, trust and developer experience."
            />
            <InfoCard
              isDark={isDark}
              label="Approach"
              title="Clear systems thinking"
              body="Less demo energy, more intentional engineering and communication."
            />
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-8 sm:px-6 md:px-10">
        <div
          className={`border-t py-6 ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div
            className={`text-[10px] uppercase tracking-[0.18em] sm:text-xs ${
              isDark ? "text-white/28" : "text-black/35"
            }`}
          >
            Project index
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className={`group relative overflow-hidden rounded-[30px] border p-6 ${
                isDark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-black/10 bg-white/55"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.14),transparent_40%)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full min-h-[360px] flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`font-mono text-xs ${
                      isDark ? "text-white/25" : "text-black/28"
                    }`}
                  >
                    {project.number}
                  </span>
                  <span className="rounded-full border border-emerald-400/18 bg-emerald-400/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300/80">
                    {project.type}
                  </span>
                </div>

                <div className="mt-8">
                  <div
                    className={`text-[10px] uppercase tracking-[0.16em] ${
                      isDark ? "text-white/28" : "text-black/36"
                    }`}
                  >
                    {project.note}
                  </div>
                  <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
                    {project.title}
                  </h2>
                </div>

                <p
                  className={`mt-5 text-sm leading-7 transition-colors duration-300 sm:text-base ${
                    isDark
                      ? "text-white/48 group-hover:text-white/70"
                      : "text-black/58 group-hover:text-black/78"
                  }`}
                >
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition duration-300 ${
                        isDark
                          ? "border-white/10 text-white/34 group-hover:border-emerald-400/20 group-hover:text-emerald-300/70"
                          : "border-black/10 text-black/42 group-hover:border-emerald-500/25 group-hover:text-emerald-700"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={`group/github flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                      isDark
                        ? "border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10"
                        : "border-black/10 hover:border-emerald-600/30 hover:bg-emerald-500/8"
                    }`}
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <GitBranch
                      size={18}
                      className={`transition-colors ${
                        isDark
                          ? "text-white/50 group-hover/github:text-emerald-400"
                          : "text-black/45 group-hover/github:text-emerald-700"
                      }`}
                    />
                  </a>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-medium transition-all duration-300 ${
                      isDark
                        ? "border-white/10 text-white/52 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                        : "border-black/10 text-black/56 hover:border-emerald-600/30 hover:bg-emerald-500/8 hover:text-emerald-700"
                    }`}
                  >
                    View project
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <footer
        className={`relative z-10 border-t ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1450px] items-center justify-between px-4 py-4 text-[10px] uppercase tracking-[0.2em] sm:px-6 md:px-10 ${
            isDark ? "text-white/25" : "text-black/35"
          }`}
        >
          <span>© 2026 Mahek Ara</span>
          <span>AI / LLM / BUILD</span>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({
  isDark,
  label,
  title,
  body,
}: {
  isDark: boolean;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        isDark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white/55"
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-[0.18em] ${
          isDark ? "text-white/35" : "text-black/38"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-3 text-lg font-medium tracking-[-0.03em] ${
          isDark ? "text-white/90" : "text-[#0f1411]"
        }`}
      >
        {title}
      </div>
      <p
        className={`mt-2 text-sm leading-6 ${
          isDark ? "text-white/46" : "text-black/58"
        }`}
      >
        {body}
      </p>
    </div>
  );
}