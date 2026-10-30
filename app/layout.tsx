import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { DesktopShell } from "./components/site-shell";

const body = localFont({
  src: [
    { path: "../public/fonts/dmsans-normal-400.ttf", weight: "400" },
    { path: "../public/fonts/dmsans-normal-500.ttf", weight: "500" },
    { path: "../public/fonts/dmsans-normal-600.ttf", weight: "600" },
  ],
  variable: "--font-body", display: "swap",
});
const signature = localFont({ src: "../public/fonts/allura-normal-400.ttf", variable: "--font-signature", display: "swap" });
const editorial = localFont({
  src: [
    { path: "../public/fonts/playfairdisplay-normal-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/playfairdisplay-italic-400.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-editorial", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mahekara.vercel.app"),
  title: {
    default: "Mahek Ara — a little corner of the internet",
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
    <html lang="en" data-theme="dark" className={`${body.variable} ${signature.variable} ${editorial.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DesktopShell>{children}</DesktopShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
