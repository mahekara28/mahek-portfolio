import Image from "next/image";
import Link from "next/link";
import portrait from "../public/images/mahek-ara.jpg";

export default function HomePage() {
  return (
    <main id="main" className="md-about" tabIndex={-1}>
      <p className="md-welcome">Hello, lovely to meet you.</p>
      <div className="md-portrait-composition">
        <div className="md-underpaper" aria-hidden="true" />
        <div className="md-photo-print">
          <Image src={portrait} alt="Mahek Ara, with a small pink flower in her hair" sizes="220px" preload />
        </div>
        <div className="md-tape" aria-hidden="true" />
      </div>
      <h1 className="md-signature">Mahek Ara</h1>
      <p className="md-description">Figuring things out by building them.</p>
      <p className="md-bio">I build AI tools, untangle workflows, and write about what I learn along the way.</p>
      <Link className="md-about-contact" href="/contact">Say hello</Link>
    </main>
  );
}
