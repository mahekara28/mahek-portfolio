import Image from "next/image";
import Link from "next/link";
import portrait from "../public/images/mahek-ara.jpg";

export default function HomePage() {
  return (
    <main id="main" className="md-about" tabIndex={-1}>
      <p className="md-welcome">Hey, glad you’re here.</p>
      <div className="md-portrait-composition">
        <div className="md-underpaper" aria-hidden="true" />
        <div className="md-photo-print">
          <Image src={portrait} alt="Mahek Ara, with a small pink flower in her hair" sizes="(max-width:700px) 144px, 190px" preload />
        </div>
        <div className="md-tape" aria-hidden="true" />
      </div>
      <h1 className="md-signature">Mahek Ara</h1>
      <p className="md-description">I like getting under the hood of AI.</p>
      <p className="md-bio">I write Python, experiment with LLM context, and try to understand where tools go wrong. I like swapping notes with other developers and sharing what I learn.</p>
      <div className="md-about-links">
        <Link className="md-primary-link" href="/projects">See my projects</Link>
        <Link className="md-secondary-link" href="/blog">Read my notes</Link>
      </div>
    </main>
  );
}
