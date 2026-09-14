"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { useTheme } from "../theme-provider";

const posts = [
  {
    title: "Your LLM Doesn't Need More Intelligence. It Needs Better Routing.",
    description:
      "A note on why model choice is less about chasing the smartest possible answer and more about building a system that knows when extra intelligence is actually worth paying for.",
    category: "AI Engineering",
    readTime: "6 min read",
    href: "/blog/llm-routing",
    status: "Published",
    year: "2026",
  },
];

export default function BlogPage() {
  const { isDark } = useTheme();

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
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
        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 md:h-[82px] md:px-10">
          <Link href="/" className="flex items-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition ${
                isDark
                  ? "border-[#d4b29f]/18 text-[#efe1d6] hover:border-[#d4b29f]/34 hover:text-[#f5e7db]"
                  : "border-[#7e3f4c]/16 text-[#24181a] hover:border-[#7e3f4c]/32 hover:text-[#7e3f4c]"
              }`}
            >
              MA
            </span>
          </Link>

          <Link
            href="/"
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition sm:text-sm ${
              isDark
                ? "border-[#d4b29f]/12 text-[#efe1d6]/46 hover:border-[#d4b29f]/30 hover:bg-[#d4b29f]/[0.04] hover:text-[#f5e7db]"
                : "border-[#7e3f4c]/12 text-black/46 hover:border-[#7e3f4c]/30 hover:bg-[#7e3f4c]/[0.04] hover:text-[#7e3f4c]"
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
        <div className="grid gap-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] sm:text-xs ${
                isDark ? "text-[#efe1d6]/56" : "text-black/48"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#d4b29f]" />
              <span>Writing</span>
            </div>

            <h1 className="mt-6 text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Notes from the
              <span className={isDark ? "block text-[#b88388]" : "block text-[#8b4652]"}>
                systems side.
              </span>
            </h1>

            <p
              className={`mt-6 max-w-[240px] text-sm leading-7 sm:text-base ${
                isDark ? "text-[#efe1d6]/58" : "text-black/58"
              }`}
            >
              Writing on AI systems, developer experience, latency, evaluation,
              security, and the small engineering decisions that quietly shape
              a product.
            </p>

            <div
              className={`mt-10 rounded-[28px] border p-5 ${
                isDark
                  ? "border-[#d4b29f]/10 bg-white/[0.02]"
                  : "border-[#7e3f4c]/10 bg-white/50"
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isDark ? "text-[#efe1d6]/32" : "text-black/38"
                }`}
              >
                Right now
              </div>
              <p
                className={`mt-3 text-sm leading-7 ${
                  isDark ? "text-[#efe1d6]/60" : "text-black/58"
                }`}
              >
                Fewer posts, more signal. I’d rather publish something properly
                thought through than fill the page with placeholder writing.
              </p>
            </div>
          </motion.aside>

          <div
            className={`border-t ${
              isDark ? "border-[#d4b29f]/10" : "border-black/10"
            }`}
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className={`group border-b py-8 sm:py-10 ${
                  isDark ? "border-[#d4b29f]/10" : "border-black/10"
                }`}
              >
                <div className="grid gap-6 lg:grid-cols-[90px_minmax(0,1fr)_170px] lg:items-start">
                  <div className="flex items-center justify-between lg:block">
                    <div
                      className={`font-mono text-xs ${
                        isDark ? "text-[#efe1d6]/26" : "text-black/30"
                      }`}
                    >
                      0{index + 1}
                    </div>
                    <div
                      className={`mt-0 text-[10px] uppercase tracking-[0.16em] lg:mt-4 ${
                        isDark ? "text-[#efe1d6]/28" : "text-black/34"
                      }`}
                    >
                      {post.year}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] ${
                        isDark ? "text-[#efe1d6]/34" : "text-black/36"
                      }`}
                    >
                      <span>{post.category}</span>
                      <span className={isDark ? "text-white/18" : "text-black/18"}>
                        •
                      </span>
                      <span className="text-[#b88388]">{post.status}</span>
                    </div>

                    <Link href={post.href} className="block">
                      <h2
                        className={`mt-4 max-w-4xl text-2xl font-medium leading-tight tracking-[-0.05em] transition duration-500 group-hover:translate-x-1 sm:text-3xl md:text-4xl ${
                          isDark
                            ? "group-hover:text-[#f5e7db]"
                            : "group-hover:text-[#7e3f4c]"
                        }`}
                      >
                        {post.title}
                      </h2>
                    </Link>

                    <p
                      className={`mt-4 max-w-3xl text-sm leading-7 sm:text-base sm:leading-8 ${
                        isDark ? "text-[#efe1d6]/52" : "text-black/60"
                      }`}
                    >
                      {post.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:block">
                    <div
                      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] ${
                        isDark ? "text-[#efe1d6]/34" : "text-black/40"
                      }`}
                    >
                      <Clock3 className="h-3.5 w-3.5 text-[#b88388]" />
                      {post.readTime}
                    </div>

                    <div className="mt-0 lg:mt-6">
                      <Link
                        href={post.href}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-medium transition-all duration-300 ${
                          isDark
                            ? "border-[#d4b29f]/12 bg-white/[0.01] text-[#efe1d6]/58 hover:border-[#d4b29f]/28 hover:bg-[#8b4652]/10 hover:text-[#f5e7db]"
                            : "border-[#7e3f4c]/12 bg-white/40 text-black/62 hover:border-[#7e3f4c]/28 hover:bg-[#7e3f4c]/[0.05] hover:text-[#7e3f4c]"
                        }`}
                      >
                        Read note
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <footer
        className={`relative z-10 border-t ${
          isDark ? "border-[#d4b29f]/10" : "border-black/10"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1450px] items-center justify-between px-4 py-4 text-[10px] uppercase tracking-[0.2em] sm:px-6 md:px-10 ${
            isDark ? "text-[#efe1d6]/26" : "text-black/32"
          }`}
        >
          <span>© 2026 Mahek Ara</span>
          <span>AI / LLM / BUILD</span>
        </div>
      </footer>
    </main>
  );
}