"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, X, Route, MessagesSquare, FileDiff, ShieldCheck, Scale, ListChecks, Clock3, ClipboardList, MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { focusAreas, isFocus, projects, reviewedOn, sourceUrl, type Focus, type Project } from "../lib/content";
import snapshot from "../lib/github-snapshot.json";
import styles from "./project-book.module.css";

const marks: Record<string, typeof Route> = {
  "llm-router": Route, "narrative-gap-mcp": MessagesSquare, "mcp-impact": FileDiff,
  "prompt-injection-lab": ShieldCheck, "build-buy-borrow": Scale, "context-relay": ListChecks,
  "knowwhen-ai": Clock3, "merchant-ops-desk": ClipboardList, insightify: MessageSquareText,
};
const shortDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(value));

function ProjectMark({ project }: { project: Project }) {
  const Mark = marks[project.id] ?? FileDiff;
  return <Mark className="work-mark" size={23} strokeWidth={1.4} aria-hidden="true" />;
}

export function ProjectBook() {
  const [filter, setFilter] = useState<Focus>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const project = projects.find((p) => p.id === selected);
  const visible = projects.filter((p) => filter === "all" || p.focus.includes(filter));

  useEffect(() => {
    function readLocation() {
      const url = new URL(window.location.href);
      const requested = projects.find((p) => p.id === url.hash.slice(1));
      const requestedFilter = url.searchParams.get("focus");
      const nextFilter = isFocus(requestedFilter) ? requestedFilter : "all";
      setFilter(requested && nextFilter !== "all" && !requested.focus.includes(nextFilter) ? "all" : nextFilter);
      setSelected(requested?.id ?? null);
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    window.addEventListener("hashchange", readLocation);
    return () => {
      window.removeEventListener("popstate", readLocation);
      window.removeEventListener("hashchange", readLocation);
    };
  }, []);

  useEffect(() => {
    if (selected) {
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.current?.open) {
        dialog.current.close();
        opener.current?.focus({ preventScroll: true });
      }
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  function choose(id: string, event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setSelected(id);
    const url = new URL(window.location.href);
    url.hash = id;
    history.pushState(null, "", url);
  }
  function close() {
    setSelected(null);
    const url = new URL(window.location.href);
    url.hash = "";
    history.pushState(null, "", url);
  }
  function changeFilter(focus: Focus) {
    setFilter(focus); setSelected(null);
    const url = new URL(window.location.href);
    url.hash = "";
    if (focus === "all") url.searchParams.delete("focus"); else url.searchParams.set("focus", focus);
    history.pushState(null, "", url);
  }

  return (
    <div className={styles.book}>
      <div className="work-toolbar">
        <div className="filter-group" role="group" aria-label="Filter projects">
          {focusAreas.map(({ id, label }) => <button key={id} aria-pressed={id === filter} onClick={() => changeFilter(id)}>{label}</button>)}
        </div>
        <span className="mono" role="status">{visible.length} projects</span>
      </div>
      <div className="work-grid">
        {visible.map((item) => (
          <article className="work-card" data-project={item.id} key={item.id}>
            <div className="work-card-top">
              <div><span className="work-number">{String(projects.indexOf(item) + 1).padStart(2, "0")}</span><p className="work-category">{item.category}</p></div>
              <ProjectMark project={item} />
            </div>
            <h2>{item.title}</h2>
            <p className="work-description">{item.description}</p>
            <ul className="work-stack" aria-label="Technologies">{item.stack.slice(0, 3).map((tech) => <li key={tech}>{tech}</li>)}</ul>
            <div className="work-card-bottom">
              <button className="work-open" aria-label={`About ${item.title}`} aria-haspopup="dialog" onClick={(event) => choose(item.id, event)}>Read notes <ArrowRight size={15} aria-hidden="true" /></button>
              <a className="work-repo" href={item.github} target="_blank" rel="noreferrer" aria-label={`${item.title} on GitHub`}>Code <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <span className="work-status">{item.status}</span>
          </article>
        ))}
      </div>
      <p className="collection-provenance">Source notes are linked to the reviewed code. GitHub metadata refreshed <time dateTime={snapshot.fetchedAt}>{shortDate(snapshot.fetchedAt)}</time>.</p>

      <dialog
        ref={dialog}
        className="case-dialog"
        aria-labelledby="case-title"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === dialog.current) close(); }}
      >
        {project && (
          <div className="case-sheet" data-project={project.id}>
            <header className="case-header">
              <span>{project.category} / {project.status}</span>
              <button className="icon-button" aria-label="Close project details" onClick={close} autoFocus><X size={21} aria-hidden="true" /></button>
            </header>
            <div className="case-body">
              <ProjectMark project={project} />
              <h2 id="case-title">{project.title}</h2>
              <p className="case-description">{project.description}</p>
              <ul className="tech-list" aria-label="Technologies">{project.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
              <div className="case-notes">
                <section><h3>The question</h3><p className="case-question">{project.question}</p></section>
                <section><h3>How it works</h3><p>{project.approach}</p></section>
                <section><h3>What it does today</h3><p className="project-boundary">{project.boundary}</p></section>
              </div>
              {project.id === "build-buy-borrow" && (
                <figure className="project-capture">
                  <a href="/projects/build-buy-borrow.png" target="_blank" rel="noreferrer" aria-label="Open full-size Build, Buy or Borrow screenshot">
                    <Image src="/projects/build-buy-borrow.png" alt="Scenario studio comparing staffing options with a team plan and itemised costs." width={1440} height={1075} sizes="(max-width: 760px) 90vw, 650px" />
                  </a>
                  <figcaption>Example people and costs in the scenario studio.</figcaption>
                </figure>
              )}
              <section className="source-files" aria-label="Source code and notes">
                <h3>Inside the repository</h3>
                <ul>{project.evidence.map((item) => (
                  <li key={item.path}><a href={sourceUrl(project, item.path)} target="_blank" rel="noreferrer"><span><span className="source-label">{item.label}</span><code>{item.path}</code></span><ArrowUpRight size={14} aria-hidden="true" /></a></li>
                ))}</ul>
              </section>
              <p className="source-review">Reviewed <time dateTime={reviewedOn}>{shortDate(reviewedOn)}</time> · <a href={`${project.github}/tree/${project.revision}`} target="_blank" rel="noreferrer" aria-label={`${project.title} reviewed revision ${project.revision.slice(0, 7)}`}>{project.revision.slice(0, 7)}</a></p>
            </div>
            <footer className="case-footer">
              <a href={project.github} target="_blank" rel="noreferrer">Open repository <ArrowUpRight size={15} aria-hidden="true" /></a>
              {project.id === "context-relay" && <Link href="/blog/context-relay" onClick={() => { dialog.current?.close(); document.body.style.overflow = ""; }}>Read the technical deep dive <ArrowRight size={15} aria-hidden="true" /></Link>}
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
