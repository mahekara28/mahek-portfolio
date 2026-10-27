import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DecisionWorld } from "./components/decision-world";
import styles from "./components/decision-world.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.home}>
      <header className={styles.identity}>
        <div>
          <h1>
            Hi, I&apos;m Mahek Ara<span>.</span>
          </h1>
          <p>
            I build AI and developer tools. I&apos;m curious about the decisions
            between an input and an answer.
          </p>
        </div>
        <Link href="/about">
          A little about me <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </header>
      <DecisionWorld />
    </main>
  );
}
