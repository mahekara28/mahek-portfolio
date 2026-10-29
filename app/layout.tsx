import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { SiteFooter, SiteHeader } from "./components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "Mahek Ara | AI tools, code & notes",
    template: "%s | Mahek Ara",
  },
  description:
    "I'm Mahek Ara. Curious about intelligent systems, and the people figuring them out. Code, experiments, and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
