"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "LLM Router",
    description:
      "Intelligent model routing based on request complexity, capability and latency.",
    stack: ["Python", "Ollama", "LLMs", "FastAPI"],
    github: "https://github.com/mahekara28/LLM---Router",
  },
  {
    number: "02",
    title: "Prompt Injection Lab",
    description:
      "A controlled environment for testing adversarial prompts and LLM security behavior.",
    stack: ["Python", "LLM Security", "FastAPI"],
    github: "https://github.com/mahekara28/Prompt-Injection-Lab",
  },
  {
    number: "03",
    title: "KnowWhen AI",
    description:
      "An intelligent planning system designed around context, availability and goals.",
    stack: ["Python", "OpenAI", "AI Automation"],
    github: "https://github.com/mahekara28/knowwhen-ai",
  },
];

export default function Projects() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#060806] text-white">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-400/[0.05] blur-[130px]" />
      </div>

      {/* NAV */}
      <nav className="relative z-20 border-b border-white/[0.08]">
        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-6 md:px-10">

          <Link
            href="/"
            className="group flex items-center gap-3 text-sm font-semibold tracking-[0.18em]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[10px] transition group-hover:border-emerald-400 group-hover:text-emerald-400">
              MA
            </span>

            <span className="hidden sm:block">MAHEK ARA</span>
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Home
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <section className="relative z-10 mx-auto max-w-[1450px] px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-emerald-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.35)]" />
            Selected work
          </div>

          <h1 className="mt-8 max-w-5xl text-[clamp(4rem,9vw,9rem)] font-semibold leading-[0.82] tracking-[-0.07em]">
            Things I&apos;ve
            <br />
            <span className="text-white/35">built.</span>
          </h1>

          <div className="mt-10 flex max-w-xl items-center gap-4">
            <div className="h-px w-12 bg-emerald-400/50" />

            <p className="text-sm leading-6 text-white/40">
              A selection of AI systems, LLM experiments and engineering
              projects I&apos;ve built while exploring intelligent software.
            </p>
          </div>
        </motion.div>
      </section>

      {/* PROJECTS */}
      <section className="relative z-10 mx-auto max-w-[1450px] px-6 pb-28 md:px-10">

        <div className="border-t border-white/10">

          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className="group relative border-b border-white/10"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-emerald-400/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="grid gap-8 py-10 md:grid-cols-[80px_1fr_1fr_180px] md:items-center md:py-14">

                {/* NUMBER */}
                <div className="font-mono text-xs text-white/25">
                  {project.number}
                </div>

                {/* TITLE */}
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-0 shadow-[0_0_12px_3px_rgba(52,211,153,0.4)] transition-opacity duration-300 group-hover:opacity-100" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
                      AI / Engineering
                    </span>
                  </div>

                  <h2 className="text-3xl font-medium tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-1 md:text-5xl">
                    {project.title}
                  </h2>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="max-w-md text-sm leading-6 text-white/40 transition-colors group-hover:text-white/60 md:text-base">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/30 transition group-hover:border-emerald-400/20 group-hover:text-emerald-300/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 md:justify-end">

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group/github flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-400/10"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <GitBranch
                      size={17}
                      className="text-white/50 transition-colors group-hover/github:text-emerald-400"
                    />
                  </a>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-medium text-white/50 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    View project
                    <ArrowUpRight size={14} />
                  </a>

                </div>
              </div>

              {/* Animated hover line */}
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-emerald-400"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.article>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-white/25 md:px-10">
          <span>© 2026 Mahek Ara</span>
          <span>AI / LLM / BUILD</span>
        </div>
      </footer>
    </main>
  );
}