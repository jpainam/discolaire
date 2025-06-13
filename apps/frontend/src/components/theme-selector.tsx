"use client";

import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useTheme } from "next-themes";
import { useLocale } from "~/i18n";
import { useThemeConfig } from "~/providers/ActiveThemeProvider";
import { defaultThemes } from "~/themes";

type ThemeKey = keyof typeof defaultThemes;

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { t } = useLocale();
  const { resolvedTheme } = useTheme();
  const currentMode = (resolvedTheme ?? "light") as "light" | "dark";
  let themeKey: ThemeKey = activeTheme as ThemeKey;
  if (!Object.keys(defaultThemes).includes(activeTheme)) {
    themeKey = "amber_minimal";
  }

  return (
    <div className="hidden md:flex items-center gap-1">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="h-7 justify-start *:data-[slot=select-value]:w-12 "
        >
          <span className="text-muted-foreground hidden sm:block">
            {t("theme")}:
          </span>
          <span className="text-muted-foreground block sm:hidden">
            {t("theme")}
          </span>
          <SelectValue placeholder={t("theme")}>
            {defaultThemes[themeKey].label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {Object.entries(defaultThemes).map(([key, theme]) => {
              return (
                <SelectItem key={key} value={key}>
                  <ColorBox color={theme[currentMode].primary} />
                  <ColorBox color={theme[currentMode].accent} />
                  <ColorBox color={theme[currentMode].secondary} />
                  <ColorBox color={theme[currentMode].border} />
                  {theme.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function ColorBox({ color }: { color: string }) {
  return (
    <div
      className="border-muted h-3 w-3 rounded-sm border"
      style={{ backgroundColor: color }}
    />
  );
}
