"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface SelectProgramThemeProps {
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}
export function ProgramThemeSelector({
  placeholder,
  className,
  onChange,
  disabled = false,
  contentClassName,
}: SelectProgramThemeProps) {
  const trpc = useTRPC();
  const programThemesQuery = useQuery(trpc.program.themes.queryOptions());

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { t } = useLocale();
  if (programThemesQuery.isPending) {
    return (
      <div>
        <Skeleton className="h-5 w-10" />
      </div>
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size={"sm"}
          disabled={disabled}
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? programThemesQuery.data?.find((d) => d.id === Number(value))?.name
            : (placeholder ?? t("select_an_option"))}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[400px] p-0", contentClassName)}>
        <Command>
          <CommandInput
            placeholder={placeholder ?? t("search_for_an_option")}
          />
          <CommandEmpty>{t("not_found")}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[400px]">
              {programThemesQuery.data?.map((d) => (
                <CommandItem
                  key={d.id}
                  //value={`${d.id}`}
                  onSelect={(_currentValue) => {
                    setValue(d.id === Number(value) ? "" : `${d.id}`);
                    onChange?.(d.id === Number(value) ? "" : `${d.id}`);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      Number(value) === d.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-1">
                      <div
                        className="flex h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: d.course.color,
                        }}
                      ></div>
                      <div className="font-semibold"> {d.course.name}</div>
                    </div>
                    <div className="pl-8 font-normal">{d.name}</div>
                  </div>
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
