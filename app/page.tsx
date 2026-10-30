import Image from "next/image";
import Link from "next/link";
import portrait from "../public/images/mahek-ara.jpg";

export default function HomePage() {
  return (
    <main id="main" className="md-about" tabIndex={-1}>
      <div className="md-builder-intro">
        <div className="md-intro-copy">
          <p className="md-welcome">AI TOOLS · DEVELOPER WORKFLOWS</p>
          <h1 className="md-signature">Mahek Ara</h1>
          <p className="md-description">I build tools that make AI useful.</p>
          <p className="md-bio">I turn rough ideas into working software, untangle workflows, and write about what I learn along the way.</p>
          <div className="md-about-links">
            <Link className="md-primary-link" href="/projects">Explore my work</Link>
            <Link className="md-secondary-link" href="/blog">Read my notes</Link>
          </div>
        </div>
        <div className="md-builder-portrait">
          <Image src={portrait} alt="Mahek Ara, with a small pink flower in her hair" sizes="(max-width:700px) 104px, 180px" preload />
        </div>
      </div>
      <div className="md-builder-footnote">
        <p>Curious about the systems behind the interface.</p>
        <Link className="text-link" href="/contact">Let’s talk</Link>
      </div>
    </main>
  );
}
