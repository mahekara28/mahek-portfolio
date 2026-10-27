import { DecisionWorld } from "./components/decision-world";
import styles from "./components/decision-world.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.home}>
      <header className={styles.identity} data-testid="home-introduction">
        <div>
          <h1>
            Hi, I&apos;m Mahek Ara<span>.</span>
          </h1>
          <p>
            I build AI and developer tools, from Python apps to MCP tooling. I
            like following an LLM&apos;s decisions, finding where things break,
            and making tools easier to use.
          </p>
        </div>
        <p className={styles.background}>
          I have a B.Tech background in AI and experience with operational
          systems. I&apos;m also drawn to DevRel and developer communities: what
          people get stuck on, and what their questions can teach us.
        </p>
      </header>
      <DecisionWorld />
    </main>
  );
}
