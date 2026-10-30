import type { Metadata } from "next";

export const metadata: Metadata = { title: "Desktop", robots: { index: false, follow: true } };

export default function DesktopPage() {
  return (
    <main id="main" className="md-empty" tabIndex={-1}>
      <h1>Make yourself at home.</h1>
      <p>Open a folder to have a look around.</p>
    </main>
  );
}
