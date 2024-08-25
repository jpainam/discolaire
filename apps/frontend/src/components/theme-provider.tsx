"use client";

import "@/styles/themes.css";

import { TooltipProvider } from "@repo/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  //const [theme] = useTheme();

  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delayDuration={0}>
        {/* <div className={cn(theme && `theme-${theme}`)}>{children}</div> */}
        {children}
      </TooltipProvider>
    </NextThemesProvider>
  );
}
