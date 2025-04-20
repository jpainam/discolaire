"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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

import { useQuery } from "@tanstack/react-query";
import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface Option {
  label: string;
  value: string;
}

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
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [items, setItems] = React.useState<Option[]>([]);
  const { t } = useLocale();
  const trpc = useTRPC();
  const subjectsQuery = useQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const subjects = subjectsQuery.data;
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    setItems(
      subjects?.map((it) => ({
        label: it.course.name,
        value: it.id.toString(),
      })) ?? [],
    );
  }, [subjects]);

  const handleSearch = (search: string) => {
    if (!subjects) return;
    const filteredItems = subjects.filter((it) =>
      it.course.name.toLowerCase().includes(search.toLowerCase()),
    );
    setItems(
      filteredItems.map((it) => ({
        label: it.course.name,
        value: it.id.toString(),
      })),
    );
  };
  if (subjectsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-full", className)} />;
  }
  if (subjectsQuery.isError) {
    showErrorToast(subjectsQuery.error);
    return null;
  }
  if (!subjects) return null;
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
            ? items.find((it) => it.value === value)?.label
            : (placeholder ?? t("select_an_option"))}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="w-[300px] p-0 "
      >
        <Command>
          <CommandInput
            onValueChange={handleSearch}
            placeholder={searchPlaceholder ?? t("search_for_an_option")}
          />
          <CommandList>
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  className="overflow-hidden"
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue == value ? null : currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
