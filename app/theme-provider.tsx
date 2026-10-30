"use client";

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      storageKey="mahek-appearance"
      defaultTheme="dark"
      themes={["dark", "light"]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export function useTheme() {
  const theme = useNextTheme();
  return {
    ...theme,
    isDark: theme.resolvedTheme !== "light",
    toggleTheme: () => theme.setTheme(theme.resolvedTheme === "light" ? "dark" : "light"),
  };
}
