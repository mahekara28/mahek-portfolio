"use client";

import { useEffect, useRef, useState } from "react";

export function ArticleContents({ sections }: { sections: { id: string; label: string }[] }) {
  const navigation = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const root = navigation.current?.closest<HTMLElement>(".md-window-content");
    const article = navigation.current?.closest("article");
    if (!root || !article) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = root.getBoundingClientRect().top + 80;
        let current = sections[0]?.id;
        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top <= line) current = section.id;
        }
        if (root.scrollHeight - root.clientHeight - root.scrollTop < 2) current = sections.at(-1)?.id ?? current;
        setActive(current);
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(article);
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
    };
  }, [sections]);

  return <aside className="md-article-toc">
    <nav ref={navigation} aria-label="On this page">
      <p>On this page</p>
      <ol>{sections.map((section, index) => <li key={section.id}>
        <a href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.label}
        </a>
      </li>)}</ol>
    </nav>
  </aside>;
}
