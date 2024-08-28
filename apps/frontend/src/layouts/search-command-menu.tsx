"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import * as React from "react";
import { useRouter } from "next/navigation";
//import { DialogProps } from "@radix-ui/react-alert-dialog";
import {
  CircleIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { LinkIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/command";
import { ScrollArea } from "@repo/ui/scroll-area";

import { usePageConfig } from "~/configs/page_config";
import { cn } from "~/lib/utils";

export function SearchCommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const { searchPages } = usePageConfig();

  const { t } = useLocale();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">{t("search")}</span>
        <span className="inline-flex lg:hidden">{t("search")}</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("search")} />
        <CommandList>
          <CommandEmpty>{t("not_found")}</CommandEmpty>
          <ScrollArea className="h-[400px] w-full">
            <CommandGroup heading={t("main_menu")}>
              {searchPages.mainNav
                .filter((navitem) => !navitem.external)
                .map((navItem) => (
                  <CommandItem
                    className="flex cursor-pointer items-center gap-2 rounded-md"
                    key={navItem.href}
                    value={navItem.title}
                    onSelect={() => {
                      runCommand(() => router.push(navItem.href ?? ""));
                    }}
                  >
                    <span>
                      {navItem.icon ? (
                        navItem.icon
                      ) : (
                        <LinkIcon className="h-5 w-5" />
                      )}
                    </span>
                    {navItem.title}
                  </CommandItem>
                ))}
            </CommandGroup>
            {searchPages.sidebarNav.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((navItem) => (
                  <CommandItem
                    key={navItem.href}
                    value={navItem.title}
                    onSelect={() => {
                      runCommand(() => router.push(navItem.href ?? ""));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <CircleIcon className="h-3 w-3" />
                    </div>
                    {navItem.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                <SunIcon className="mr-2 h-4 w-4" />
                Light
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                <MoonIcon className="mr-2 h-4 w-4" />
                Dark
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme("system"))}
              >
                <LaptopIcon className="mr-2 h-4 w-4" />
                System
              </CommandItem>
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
}
