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
  CommandList,
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface SelectCoursesProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  contentClassName?: string;
  onChange?: (value: string | null | undefined) => void;
  disabled?: boolean;
}

export function CourseSelector({
  placeholder,
  className,
  onChange,
  defaultValue,
  disabled = false,
  contentClassName,
}: SelectCoursesProps) {
  const trpc = useTRPC();
  const coursesQuery = useQuery(trpc.course.all.queryOptions());

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const { t } = useLocale();
  if (coursesQuery.isPending) {
    return (
      <div>
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const data = coursesQuery.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? data.find((d) => d.id === value)?.name
            : (placeholder ?? t("select_an_option"))}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className={cn("p-0", contentClassName)}
      >
        <Command
          filter={(value, search) => {
            const item = data.find((it) => it.id === value);
            if (item?.name.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder={placeholder ?? t("search_for_an_option")}
          />
          <CommandList>
            <CommandEmpty>{t("not_found")}</CommandEmpty>
            <CommandGroup>
              {coursesQuery.data?.map((item) => (
                <CommandItem
                  key={item.id}
                  className="overflow-hidden"
                  value={item.id}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue == value ? null : currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-row items-center space-x-1">
                    <div
                      className="flex h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    ></div>
                    <div> {item.name}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
