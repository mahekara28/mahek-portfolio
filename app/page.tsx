import Link from "next/link";
import { DecisionWorld } from "./components/decision-world";
import styles from "./components/decision-world.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.home}>
      <header className={styles.identity} data-testid="home-introduction">
        <h1>
          <span className={styles.greeting}>Hi, I&apos;m</span> Mahek Ara
          <span className={styles.period}>.</span>
        </h1>
        <p>
          I build AI and developer tools. Recently:{" "}
          <Link href="/projects#llm-router">local model routing</Link>,{" "}
          <Link href="/projects#mcp-impact">MCP contract changes</Link>, and the{" "}
          <Link href="/projects#narrative-gap-mcp">
            questions developers leave in GitHub issues
          </Link>
          .
        </p>
        <p className={styles.background}>
          I like changing one assumption and following what happens next.
        </p>
      </header>
      <DecisionWorld />
    </main>
  );
}
