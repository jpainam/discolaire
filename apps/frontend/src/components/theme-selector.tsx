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
import { useLocale } from "~/i18n";
import { THEMES } from "~/lib/themes";
import { useThemeConfig } from "~/providers/ActiveThemeProvider";

// const DEFAULT_THEMES = [
//   {
//     name: "Default",
//     value: "default",
//   },
//   {
//     name: "Blue",
//     value: "blue",
//   },
//   {
//     name: "Green",
//     value: "green",
//   },
//   {
//     name: "Amber",
//     value: "amber",
//   },
// ];

// const SCALED_THEMES = [
//   {
//     name: "Default",
//     value: "default-scaled",
//   },
//   {
//     name: "Blue",
//     value: "blue-scaled",
//   },
// ];

// const MONO_THEMES = [
//   {
//     name: "Mono",
//     value: "mono-scaled",
//   },
// ];

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
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
          <SelectGroup>
            {/* <SelectLabel>Default</SelectLabel> */}
            {THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          {/* <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Scaled</SelectLabel>
            {SCALED_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Monospaced</SelectLabel>
            {MONO_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup> */}
        </SelectContent>
      </Select>
    </div>
  );
}
