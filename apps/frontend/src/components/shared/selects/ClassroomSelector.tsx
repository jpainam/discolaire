"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface ClassroomSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  size?: "tiny" | "small";
  onChange?: (value: string | null | undefined) => void;
}

export function ClassroomSelector({
  searchPlaceholder,
  placeholder,
  className,
  //size = "tiny",
  disabled = false,
  defaultValue,
  onChange,
}: ClassroomSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );

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
          {classrooms.find((it) => it.id === value)?.name ??
            placeholder ??
            t("select_an_option")}{" "}
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
            const item = classrooms.find((it) => it.id === value);
            if (item?.name.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder={searchPlaceholder ?? t("search_for_an_option")}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              {classrooms.map((item) => (
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
                  <span>{item.name}</span>
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
