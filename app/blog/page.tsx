"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { useTheme } from "../theme-provider";

const featuredPost = {
  title: "Your LLM Doesn't Need More Intelligence. It Needs Better Routing.",
  description:
    "I built an LLM router and realized that model selection isn't really a classification problem. It's a systems problem.",
  category: "AI Engineering",
  readTime: "7 min read",
  href: "/blog/llm-routing",
  year: "2026",
};

export default function Blog() {
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
            isDark ? "bg-emerald-500/[0.05]" : "bg-emerald-500/[0.10]"
          }`}
        />
        <div
          className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[130px] ${
            isDark ? "bg-emerald-400/[0.04]" : "bg-emerald-400/[0.08]"
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

      <section className="relative z-10 mx-auto max-w-[1450px] px-4 pb-16 pt-14 sm:px-6 md:px-10 md:pb-24 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] sm:text-xs ${
                isDark ? "text-emerald-400/80" : "text-emerald-700/85"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.35)]" />
              Writing
            </div>

            <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Notes &
              <span className={isDark ? "block text-white/35" : "block text-black/35"}>
                articles.
              </span>
            </h1>
          </motion.aside>

          <div>
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className={`group border-y py-8 sm:py-10 ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              <div className="grid gap-6 lg:grid-cols-[90px_minmax(0,1fr)_150px] lg:items-start">
                <div className="flex items-center justify-between lg:block">
                  <div
                    className={`font-mono text-xs ${
                      isDark ? "text-white/24" : "text-black/30"
                    }`}
                  >
                    01
                  </div>
                  <div
                    className={`mt-0 text-[10px] uppercase tracking-[0.16em] lg:mt-4 ${
                      isDark ? "text-white/24" : "text-black/30"
                    }`}
                  >
                    {featuredPost.year}
                  </div>
                </div>

                <div className="min-w-0">
                  <div
                    className={`flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] ${
                      isDark ? "text-white/28" : "text-black/36"
                    }`}
                  >
                    <span>{featuredPost.category}</span>
                    <span className={isDark ? "text-white/18" : "text-black/20"}>
                      •
                    </span>
                    <span className={isDark ? "text-emerald-300/75" : "text-emerald-700/80"}>
                      Published
                    </span>
                  </div>

                  <Link href={featuredPost.href} className="block">
                    <h2
                      className={`mt-4 max-w-4xl text-2xl font-medium leading-tight tracking-[-0.05em] transition duration-500 group-hover:translate-x-1 sm:text-3xl md:text-4xl ${
                        isDark ? "group-hover:text-emerald-100" : "group-hover:text-emerald-700"
                      }`}
                    >
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p
                    className={`mt-4 max-w-3xl text-sm leading-7 sm:text-base sm:leading-8 ${
                      isDark ? "text-white/46" : "text-black/58"
                    }`}
                  >
                    {featuredPost.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 lg:block">
                  <div
                    className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] ${
                      isDark ? "text-white/28" : "text-black/36"
                    }`}
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </div>

                  <div className="mt-0 lg:mt-6">
                    <Link
                      href={featuredPost.href}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-medium transition-all duration-300 ${
                        isDark
                          ? "border-white/10 text-white/52 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                          : "border-black/10 text-black/56 hover:border-emerald-600/30 hover:bg-emerald-500/8 hover:text-emerald-700"
                      }`}
                    >
                      Read
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className={`border-b py-10 sm:py-12 ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              <div className="max-w-2xl">
                <div
                  className={`text-[10px] uppercase tracking-[0.16em] ${
                    isDark ? "text-white/28" : "text-black/36"
                  }`}
                >
                  Currently writing
                </div>
                <p
                  className={`mt-4 text-lg leading-8 sm:text-xl ${
                    isDark ? "text-white/58" : "text-black/66"
                  }`}
                >
                  More notes on AI systems, latency, prompt injection, and
                  developer-facing tooling are on the way.
                </p>
              </div>
            </motion.div>
          </div>
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