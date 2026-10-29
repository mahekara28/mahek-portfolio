import Link from "next/link";
import { SmallestChange } from "./components/smallest-change";
import styles from "./components/smallest-change.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.home}>
      <header className={styles.identity} data-testid="home-introduction">
        <h1>
          <span className={styles.greeting}>Hi, I&apos;m</span> Mahek Ara.
        </h1>
        <p>
          I build AI and developer tools. Recently, that&apos;s meant{" "}
          <Link href="/projects#llm-router">local model routing</Link>,{" "}
          <Link href="/projects#mcp-impact">MCP contract checks</Link>, and{" "}
          <Link href="/projects#narrative-gap-mcp">
            making sense of developer feedback
          </Link>
          .
        </p>
        <p className={styles.background}>
          I like changing one assumption and following what happens next.
        </p>
      </header>
      <SmallestChange />
    </main>
  );
}
