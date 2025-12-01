"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const COOKIE_NAME = "active_theme";
const DEFAULT_THEME = "caffeine";

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
}

interface ThemeContextType {
  activeTheme: string;
  isScaled: boolean;
  setActiveTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
  isScaled,
}: {
  children: ReactNode;
  initialTheme?: string;
  isScaled?: boolean;
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme ?? DEFAULT_THEME,
  );

  useEffect(() => {
    setThemeCookie(activeTheme);

    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className);
      });
    document.body.classList.add(`theme-${activeTheme}`);
    if (isScaled) document.body.classList.add("theme-scaled");
    // if (activeTheme.endsWith("-scaled")) {
    //   document.body.classList.add("theme-scaled");
    // }
  }, [activeTheme, isScaled]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ThemeContext.Provider
        value={{ activeTheme, setActiveTheme, isScaled: isScaled ?? false }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ThemeProvider");
  }
  return context;
}
