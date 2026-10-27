"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Theme = "dark" | "light";
type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
};
const VisitTheme = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Each document starts dark. A manual choice lasts through client navigation,
  // but an older localStorage value cannot change the next visit's first frame.
  const [theme, setTheme] = useState<Theme>("dark");
  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return (
    <VisitTheme.Provider value={value}>
      <NextThemeProvider
        attribute="data-theme"
        forcedTheme={theme}
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </NextThemeProvider>
    </VisitTheme.Provider>
  );
}
export function useTheme() {
  const value = useContext(VisitTheme);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
