"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Skeleton } from "@repo/ui/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface ClassroomSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function ClassroomSelector({
  searchPlaceholder,
  placeholder,
  className,
  defaultValue,
  onChange,
}: ClassroomSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const { t } = useLocale();
  const classroomsQuery = api.classroom.all.useQuery();

  if (classroomsQuery.isPending) {
    return <Skeleton className={cn("h-8 w-full", className)} />;
  }
  if (classroomsQuery.isError) {
    toast.error(classroomsQuery.error.message);
    return null;
  }

  const data = classroomsQuery.data;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {data.find((it) => it.id === value)?.name ??
            placeholder ??
            t("select_an_option")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" sameWidthAsTrigger={true}>
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
            placeholder={
              searchPlaceholder ? searchPlaceholder : t("search_for_an_option")
            }
          />
          <CommandList>
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              {classroomsQuery.data.map((item) => (
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
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
