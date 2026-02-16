import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Uniwind, useUniwind } from "uniwind";

export type ThemeName =
  | "light"
  | "dark"
  | "lavender-light"
  | "lavender-dark"
  | "mint-light"
  | "mint-dark"
  | "sky-light"
  | "sky-dark";

export interface ThemeOption {
  id: "default" | "lavender" | "mint" | "sky";
  name: string;
  lightVariant: ThemeName;
  darkVariant: ThemeName;
}

export const availableThemes: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    lightVariant: "light",
    darkVariant: "dark",
  },
  {
    id: "lavender",
    name: "Lavender",
    lightVariant: "lavender-light",
    darkVariant: "lavender-dark",
  },
  {
    id: "mint",
    name: "Mint",
    lightVariant: "mint-light",
    darkVariant: "mint-dark",
  },
  {
    id: "sky",
    name: "Sky",
    lightVariant: "sky-light",
    darkVariant: "sky-dark",
  },
];

interface AppThemeContextType {
  currentTheme: string;
  currentThemeOption: ThemeOption;
  isLight: boolean;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  setThemeOption: (themeOptionId: ThemeOption["id"]) => void;
  toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined,
);

function getThemeOptionForTheme(theme: string): ThemeOption {
  return (
    availableThemes.find(
      (themeOption) =>
        themeOption.lightVariant === theme || themeOption.darkVariant === theme,
    ) ?? availableThemes[0]
  );
}

const DEFAULT_THEME: ThemeName = "sky-light";

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useUniwind();
  const hasSetDefault = useRef(false);

  useEffect(() => {
    if (!hasSetDefault.current) {
      hasSetDefault.current = true;
      if (theme === "light" || theme === "dark") {
        Uniwind.setTheme(DEFAULT_THEME as never);
      }
    }
  }, [theme]);
  const currentThemeOption = useMemo(
    () => getThemeOptionForTheme(theme),
    [theme],
  );

  const isLight = useMemo(() => {
    return theme === "light" || theme.endsWith("-light");
  }, [theme]);

  const isDark = useMemo(() => {
    return theme === "dark" || theme.endsWith("-dark");
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme as never);
  }, []);

  const setThemeOption = useCallback(
    (themeOptionId: ThemeOption["id"]) => {
      const selectedTheme = availableThemes.find(
        (themeOption) => themeOption.id === themeOptionId,
      );
      if (!selectedTheme) return;

      Uniwind.setTheme(
        (isDark
          ? selectedTheme.darkVariant
          : selectedTheme.lightVariant) as never,
      );
    },
    [isDark],
  );

  const toggleTheme = useCallback(() => {
    Uniwind.setTheme(
      (isLight
        ? currentThemeOption.darkVariant
        : currentThemeOption.lightVariant) as never,
    );
  }, [currentThemeOption, isLight]);

  const value = useMemo(
    () => ({
      currentTheme: theme,
      currentThemeOption,
      isLight,
      isDark,
      setTheme,
      setThemeOption,
      toggleTheme,
    }),
    [
      theme,
      currentThemeOption,
      isLight,
      isDark,
      setTheme,
      setThemeOption,
      toggleTheme,
    ],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
