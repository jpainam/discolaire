"use client";

import { useEffect, useState } from "react";
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

import { useLocale } from "~/i18n";
import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

interface StaffSelectorProps {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const StaffSelector = ({
  className,
  disabled = false,
  onChange,
  placeholder,
  searchPlaceholder,
  defaultValue,
}: StaffSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const { t } = useLocale();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const trpc = useTRPC();
  const {
    data: staffs,
    isPending,
    isError,
    error,
  } = useQuery(trpc.staff.all.queryOptions());

  if (isError) {
    showErrorToast(error);
    return null;
  }
  if (isPending) {
    return <div className="w-[300px]"></div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(`w-full justify-between`, className)}
        >
          <div className="flex w-full gap-1">
            <p className="text-foreground">
              {value
                ? getFullName(staffs.find((staff) => staff.id === value))
                : (placeholder ?? t("select_an_option"))}
            </p>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="p-0"
        side="bottom"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder ?? t("search_for_an_option")}
          />
          <CommandList>
            <CommandEmpty>{t("not_found")}</CommandEmpty>
            <CommandGroup>
              {staffs.map((staff) => (
                <CommandItem
                  key={staff.id}
                  className="flex w-full cursor-pointer items-center justify-between space-x-2"
                  onSelect={() => {
                    setValue(staff.id);
                    setOpen(false);
                    onChange?.(staff.id);
                  }}
                >
                  <span>{getFullName(staff)}</span>
                  {value === staff.id && (
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
};
