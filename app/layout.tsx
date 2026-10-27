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
    "I'm Mahek. I build AI and developer tools and write about how they work. A few projects: RouterFlow, MCP Impact and Narrative Gap MCP. Code, experiments and notes.",
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
