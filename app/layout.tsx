import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "Mahek Ara",
  description: "AI Engineer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}