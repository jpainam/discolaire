import * as React from "react";
import { useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { decode } from "entities";
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
import { cn } from "@repo/ui/lib/utils";

import { useTRPC } from "~/trpc/react";

interface Props {
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  onSelect?: (classroomId: string | null) => void;
}

export function ClassroomSelector({
  defaultValue,
  onSelect,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const trpc = useTRPC();
  const classroomQuery = useQuery(trpc.classroom.all.queryOptions());

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const selected = classroomQuery.data?.find(
    (classroom) => classroom.id === value,
  );
  const t = useTranslations();
  const classrooms = classroomQuery.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-full justify-between truncate font-normal",
            className,
          )}
        >
          {selected ? decode(selected.name) : t("Select a classroom")}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        //portal={false}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command
          filter={(value, search) => {
            const item = classrooms.find((it) => it.id === value);
            if (item?.name.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput
            placeholder={t("search")}
            className="h-9 px-2"
            autoComplete="off"
          />
          <CommandEmpty>{t("no_data")}</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-[230px] overflow-y-auto pt-2">
              {classrooms.map((classroom) => (
                <CommandItem
                  key={classroom.id}
                  value={classroom.id}
                  onSelect={() => {
                    setValue(classroom.id === value ? "" : classroom.id);
                    onSelect?.(classroom.id === value ? null : classroom.id);
                    setOpen(false);
                  }}
                >
                  {decode(classroom.name)}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === classroom.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
