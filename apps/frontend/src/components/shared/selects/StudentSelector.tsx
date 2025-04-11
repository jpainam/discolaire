"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

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
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

interface SelectorProps {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string | null | undefined) => void;
}

export function StudentSelector({
  className,
  disabled = false,
  defaultValue,
  onChange,
}: SelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const { t } = useLocale();
  const [label, setLabel] = React.useState(t("select_an_option"));
  const trpc = useTRPC();
  const studentsQuery = useQuery(trpc.student.all.queryOptions());

  React.useEffect(() => {
    if (studentsQuery.data) {
      const student = studentsQuery.data.find((it) => it.id === value);
      if (student) {
        setLabel(getFullName(student));
      }
    }
  }, [studentsQuery.data, value]);

  if (studentsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-full", className)} />;
  }
  if (studentsQuery.isError) {
    toast.error(studentsQuery.error.message);
    return null;
  }

  const data = studentsQuery.data;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="p-0"
        side="bottom"
        align="start"
      >
        <Command
          //className="rounded-lg border shadow-md"
          filter={(value, search) => {
            const item = data.find((it) => it.id === value);
            const name = getFullName(item);
            if (name.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={t("search_for_an_option")} />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  className="flex w-full cursor-pointer items-center justify-between space-x-2"
                  value={item.id}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue == value ? null : currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <span>{getFullName(item)}</span>
                  {value === item.id && (
                    <Check className="text-brand" strokeWidth={2} size={16} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
