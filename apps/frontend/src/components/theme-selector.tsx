"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useLocale } from "~/i18n";
import { THEMES } from "~/lib/themes";
import { useThemeConfig } from "~/providers/ActiveThemeProvider";

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { t } = useLocale();

  return (
    <Select value={activeTheme} onValueChange={setActiveTheme}>
      <SelectTrigger
        id="theme-selector"
        size="sm"
        className="h-8 justify-start *:data-[slot=select-value]:w-12 "
      >
        <span className="text-muted-foreground hidden sm:block">
          {t("theme")}:
        </span>
        <span className="text-muted-foreground block sm:hidden">
          {t("theme")}
        </span>
        <SelectValue placeholder={t("theme")} />
      </SelectTrigger>
      <SelectContent align="end">
        {THEMES.map((theme) => (
          <SelectItem key={theme.name} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
