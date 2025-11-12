"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

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

import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface ClassroomSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  classroomId: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function SubjectSelector({
  searchPlaceholder,

  placeholder,
  className,
  classroomId,
  defaultValue,
  onChange,
}: ClassroomSelectorProps) {
  const trpc = useTRPC();
  const subjectsQuery = useQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const t = useTranslations();
  if (subjectsQuery.isPending) {
    return (
      <div>
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const data = subjectsQuery.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? decode(
                data.find((d) => d.id === Number(value))?.course.name ?? "",
              )
            : (placeholder ?? t("Select a subject"))}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="w-[300px] p-0"
      >
        <Command
          filter={(value, search) => {
            const item = value
              ? data.find((it) => it.id === Number(value))
              : null;
            if (
              item?.course.name.toLowerCase().includes(search.toLowerCase())
            ) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder={searchPlaceholder ?? t("search_for_an_option")}
          />
          <CommandList>
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              {subjectsQuery.data?.map((item) => (
                <CommandItem
                  key={item.id}
                  className="overflow-hidden"
                  value={item.id.toString()}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue == value ? null : currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      Number(value) === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {decode(item.course.name)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
