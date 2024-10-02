"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

interface StaffSelectorProps {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  supportSelectAll?: boolean;
  excludedLevels?: string[];
  searchPlaceholder?: string;

  onSelectCreateLevel?: () => void;
}

export const StaffSelector = ({
  className,
  disabled = false,
  onChange,
  placeholder,
  searchPlaceholder,
  defaultValue,
  onSelectCreateLevel,
}: StaffSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const { t } = useLocale();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const { data: staffs, isPending, isError, error } = api.staff.all.useQuery();

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
        className="p-0"
        side="bottom"
        align="start"
        sameWidthAsTrigger={true}
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
            {onSelectCreateLevel !== undefined && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="flex w-full cursor-pointer items-center gap-x-2"
                    onSelect={() => {
                      onSelectCreateLevel();
                      setOpen(false);
                    }}
                    onClick={() => {
                      onSelectCreateLevel();
                      setOpen(false);
                    }}
                  >
                    <Plus size={12} />
                    Create a new schema
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
