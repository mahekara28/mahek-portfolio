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
    "I'm Mahek. I build AI tools in Python and write about how they work. My projects include RouterFlow, Context Relay and MCP Impact, with code, tests and notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
