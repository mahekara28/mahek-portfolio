import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DesktopShell } from "./components/site-shell";
import { ThemeProvider } from "./theme-provider";

const text = localFont({
  src: "../public/fonts/instrument-sans-latin.woff2", weight: "400 700",
  variable: "--font-text", display: "swap",
});
const display = localFont({ src: "../public/fonts/fraunces-latin.woff2", weight: "100 900", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mahekara.vercel.app"),
  title: {
    default: "Mahek Ara — AI tools & developer workflows",
    template: "%s | Mahek Ara",
  },
  description:
    "I’m Mahek. I write Python, experiment with LLM context and developer tools, and share what I learn. Find my projects and notes here.",
  openGraph: {
    siteName: "Mahek Ara", type: "website",
    title: "Mahek Ara — code, AI & notes",
    description: "Python, LLM context, developer tools, and notes on what I learn along the way.",
    images: [{ url: "/images/mahek-ara.jpg", width: 400, height: 400, alt: "Mahek Ara" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${text.variable} ${display.variable}`}>
      <body>
        <ThemeProvider><DesktopShell>{children}</DesktopShell></ThemeProvider>
      </body>
    </html>
  );
}
