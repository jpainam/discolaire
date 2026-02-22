"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { defaultThemes } from "~/themes";

const COOKIE_NAME = "active_theme";
const DEFAULT_THEME = "default";

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
}

function setScaledCookie(scaled: boolean) {
  if (typeof window === "undefined") return;

  document.cookie = `theme-scaled=${scaled}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
}

interface ThemeContextType {
  activeTheme: string;
  isScaled: boolean;
  setActiveTheme: (theme: string) => void;
  setIsScaled: (scaled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
  isScaled: initialIsScaled,
}: {
  children: ReactNode;
  initialTheme?: string;
  isScaled?: boolean;
}) {
  const [activeTheme, setActiveTheme] = useState<string>(() =>
    initialTheme && Object.keys(defaultThemes).includes(initialTheme)
      ? initialTheme
      : DEFAULT_THEME,
  );
  const [isScaled, setIsScaledState] = useState<boolean>(
    initialIsScaled ?? false,
  );

  const setActiveThemeSafe = (theme: string) => {
    setActiveTheme(
      Object.keys(defaultThemes).includes(theme) ? theme : DEFAULT_THEME,
    );
  };

  const setIsScaled = (scaled: boolean) => {
    setIsScaledState(scaled);
    setScaledCookie(scaled);
  };

  useEffect(() => {
    const nextTheme = Object.keys(defaultThemes).includes(activeTheme)
      ? activeTheme
      : DEFAULT_THEME;

    setThemeCookie(nextTheme);

    // Update body classes
    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className);
      });
    if (nextTheme !== "default") {
      document.body.classList.add(`theme-${nextTheme}`);
    }
    if (isScaled) document.body.classList.add("theme-scaled");

    // Also update the SSR wrapper div so themes switch without a page reload
    const themeRoot = document.getElementById("theme-root");
    if (themeRoot) {
      Array.from(themeRoot.classList)
        .filter((className) => className.startsWith("theme-"))
        .forEach((className) => {
          themeRoot.classList.remove(className);
        });
      if (nextTheme !== "default") {
        themeRoot.classList.add(`theme-${nextTheme}`);
      }
    }
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
        value={{
          activeTheme,
          setActiveTheme: setActiveThemeSafe,
          isScaled,
          setIsScaled,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useThemeConfig(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ThemeProvider");
  }
  return context;
}
