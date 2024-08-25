"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import { Check, ChevronsUpDown } from "lucide-react";

type SelectCoursesProps = {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  contentClassName?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};
export function CourseSelector({
  placeholder,
  className,
  onChange,
  defaultValue,
  disabled = false,
  contentClassName,
}: SelectCoursesProps) {
  const coursesQuery = api.course.all.useQuery();

  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const data = coursesQuery.data;

  const { t } = useLocale();
  if (coursesQuery.isPending) {
    return (
      <div>
        <Skeleton className="h-5 w-full" />
      </div>
    );
  }
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
            ? data?.find((d) => d.id === value)?.name
            : placeholder || t("select_an_option")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", contentClassName)}
        sameWidthAsTrigger={true}
      >
        <Command>
          <CommandInput
            placeholder={placeholder || t("search_for_an_option")}
          />
          <CommandEmpty>{t("not_found")}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[400px]">
              {data?.map((d) => (
                <CommandItem
                  key={d.id}
                  //value={`${d.id}`}
                  onSelect={(currentValue) => {
                    setValue(d.id === value ? "" : `${d.id}`);
                    onChange?.(d.id === value ? "" : `${d.id}`);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === d.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-row items-center space-x-1">
                    <div
                      className="flex h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: d?.color ?? "lightgray",
                      }}
                    ></div>
                    <div> {d?.name}</div>
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
