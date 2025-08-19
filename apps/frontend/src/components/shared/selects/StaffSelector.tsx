import * as React from "react";
import { useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
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
import { getFullName } from "~/utils";

interface Props {
  defaultValue: string;
  className?: string;
  disabled?: boolean;
  onSelect?: (staffId: string) => void;
}

export function StaffSelector({
  defaultValue,
  onSelect,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const trpc = useTRPC();
  const staffQuery = useQuery(trpc.staff.all.queryOptions());

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue, value]);

  const selected = staffQuery.data?.find((staff) => staff.id === value);
  const t = useTranslations();

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
          {selected ? getFullName(selected) : t("Select a staff")}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        portal={false}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command loop>
          <CommandInput
            placeholder={t("search")}
            className="h-9 px-2"
            autoComplete="off"
          />
          <CommandEmpty>{t("no_data")}</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-[230px] overflow-y-auto pt-2">
              {staffQuery.data?.map((staff) => (
                <CommandItem
                  key={staff.id}
                  value={staff.id}
                  onSelect={() => {
                    setValue(staff.id === value ? "" : staff.id);
                    onSelect?.(staff.id === value ? "" : staff.id);
                    setOpen(false);
                  }}
                >
                  {getFullName(staff)}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === staff.id ? "opacity-100" : "opacity-0",
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
