"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";

import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type Option = {
  label: string;
  value: string;
};

type ClassroomSelectorProps = {
  searchPlaceholder?: string;
  placeholder?: string;
  classroomId: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
};

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
  const subjectsQuery = api.classroom.subjects.useQuery({
    id: classroomId,
  });

  const subjects = subjectsQuery.data;
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    setItems(
      subjects?.map((it) => ({
        label: it.course?.name || "",
        value: it.id.toString(),
      })) ?? [],
    );
  }, [subjects]);

  const handleSearch = (search: string) => {
    if (!subjects) return;
    const filteredItems = subjects.filter((it) =>
      it?.course?.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setItems(
      filteredItems.map((it) => ({
        label: it.course?.name || "",
        value: it.id.toString(),
      })),
    );
  };
  if (subjectsQuery.isPending) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
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
            : placeholder
              ? placeholder
              : t("select_an_option")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" sameWidthAsTrigger={true}>
        <Command>
          <CommandInput
            onValueChange={handleSearch}
            placeholder={
              searchPlaceholder ? searchPlaceholder : t("search_for_an_option")
            }
          />
          <CommandList>
            <CommandEmpty>{t("select_an_option")}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px] w-full">
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    className="overflow-hidden"
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange &&
                        onChange(currentValue == value ? null : currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
