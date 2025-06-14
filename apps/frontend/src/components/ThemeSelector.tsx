"use client";
import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { Check, ChevronDown, Moon, Shuffle, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { META_THEME_COLORS, useMetaColor } from "~/hooks/use-meta-color";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useThemeConfig } from "~/providers/ActiveThemeProvider";
import { defaultThemes } from "~/themes";

type ThemeKey = keyof typeof defaultThemes;

export function ThemeSelector({ className }: { className?: string }) {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { t } = useLocale();

  const { resolvedTheme } = useTheme();
  const currentMode = (resolvedTheme ?? "light") as "light" | "dark";
  let themeKey: ThemeKey = activeTheme as ThemeKey;
  if (!Object.keys(defaultThemes).includes(activeTheme)) {
    themeKey = "amber_minimal";
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="theme-selector"
          size="sm"
          variant="ghost"
          className={cn(
            "h-7 text-xs justify-start *:data-[slot=select-value]:w-12",
            className,
          )}
        >
          <span className="text-muted-foreground hidden sm:block">
            {t("theme")}:
          </span>
          <span className="text-muted-foreground block sm:hidden">
            {t("theme")}
          </span>
          <span>{defaultThemes[themeKey].label}</span>
          <ChevronDown className="size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="center">
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
            <CommandEmpty>{t("No themes found.")}</CommandEmpty>
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
  const { setActiveTheme } = useThemeConfig();
  const { setMetaColor } = useMetaColor();
  const { setTheme, resolvedTheme } = useTheme();

  const presetNames = Object.keys(defaultThemes) as ThemeKey[];

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    setActiveTheme(presetNames[random] ?? "amber_minimal");
  }, [presetNames, setActiveTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark,
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={toggleTheme}
          >
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
            size="sm"
            className="h-7 w-7 p-0"
            onClick={randomize}
          >
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
