"use client";

import { useCallback } from "react";
import {
  BarcodeIcon,
  Check,
  ChevronRight,
  Moon,
  Scaling,
  Shuffle,
  Sun,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { META_THEME_COLORS, useMetaColor } from "~/hooks/use-meta-color";
import { useThemeConfig } from "~/providers/ThemeProvider";
import { defaultThemes } from "~/themes";

type ThemeKey = keyof typeof defaultThemes;

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const t = useTranslations();

  const { resolvedTheme } = useTheme();
  const currentMode = (resolvedTheme ?? "light") as "light" | "dark";
  let themeKey: ThemeKey = activeTheme as ThemeKey;
  if (!Object.keys(defaultThemes).includes(activeTheme)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    themeKey = "default";
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="theme-selector"
          className="flex w-full justify-between"
          variant="ghost"
        >
          <div className="flex items-center gap-2">
            <BarcodeIcon className="text-muted-foreground" />
            {/* <span>{defaultThemes[themeKey].label}</span> */}
            <span>{t("theme")}</span>
          </div>
          <ChevronRight className="size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-[300px] p-0" align="start">
        <Command className="h-100 w-full rounded-lg border shadow-md">
          <CommandInput placeholder={t("search")} />
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-muted-foreground text-xs">
              {Object.keys(defaultThemes).length} themes
            </div>
            <ThemeControls />
          </div>
          <Separator />
          <CommandList className="h-[500px] max-h-[70vh]">
            <CommandEmpty>{t("No themes found")}</CommandEmpty>
            {Object.keys(defaultThemes).length > 0 && (
              <CommandGroup>
                {Object.entries(defaultThemes).map(([key, theme], index) => {
                  const preset = theme[currentMode];
                  return (
                    <CommandItem
                      key={`${key}-${index}`}
                      value={`${key}-${index}`}
                      onSelect={() => {
                        setActiveTheme(key);
                      }}
                      className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                    >
                      <ThemeColors preset={preset} />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-xs font-medium capitalize">
                          {theme.label}
                        </span>
                      </div>
                      {key === activeTheme && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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

function ThemeControls() {
  const { setActiveTheme, isScaled, setIsScaled } = useThemeConfig();
  const { setMetaColor } = useMetaColor();
  const { setTheme, resolvedTheme } = useTheme();

  const presetNames = Object.keys(defaultThemes) as ThemeKey[];

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    setActiveTheme(presetNames[random] ?? "default");
  }, [presetNames, setActiveTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark,
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  const toggleScaled = useCallback(() => {
    setIsScaled(!isScaled);
  }, [isScaled, setIsScaled]);

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0" onClick={toggleTheme}>
            {resolvedTheme === "light" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Toggle theme</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={toggleScaled}
            data-active={isScaled}
          >
            <Scaling
              className={`h-3.5 w-3.5 ${isScaled ? "text-primary" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{isScaled ? "Disable scaling" : "Enable scaling"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0" onClick={randomize}>
            <Shuffle className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Random theme</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function ThemeColors({
  preset,
}: {
  preset: {
    primary: string;
    accent: string;
    secondary: string;
    border: string;
  };
}) {
  return (
    <div className="flex gap-0.5">
      <ColorBox color={preset.primary} />
      <ColorBox color={preset.accent} />
      <ColorBox color={preset.secondary} />
      <ColorBox color={preset.border} />
    </div>
  );
}
