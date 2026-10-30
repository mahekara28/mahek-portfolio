import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DesktopShell } from "./components/site-shell";

const text = localFont({
  src: [
    { path: "../public/fonts/nunito-latin-normal.woff2", weight: "400 800", style: "normal" },
    { path: "../public/fonts/nunito-latin-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-text", display: "swap",
});
const heading = localFont({ src: "../public/fonts/hanken.ttf", variable: "--font-heading", display: "swap" });
const signature = localFont({ src: "../public/fonts/allura-normal-400.ttf", variable: "--font-signature", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mahekara.vercel.app"),
  title: {
    default: "Mahek Ara — AI tools & developer workflows",
    template: "%s | Mahek Ara",
  },
  description:
    "I build AI tools, untangle workflows, and write about what I learn along the way. Step inside Mahek Ara’s personal desktop.",
  openGraph: {
    siteName: "Mahek Ara", type: "website",
    title: "Mahek Ara — AI tools, thoughtful workflows & notes",
    description: "Figuring things out by building them.",
    images: [{ url: "/images/mahek-ara.jpg", width: 400, height: 400, alt: "Mahek Ara" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${text.variable} ${signature.variable} ${heading.variable}`}>
      <body>
        <DesktopShell>{children}</DesktopShell>
      </body>
    </html>
  );
}
