"use client";

import type { ALIGN_OPTIONS } from "@radix-ui/react-popper";
import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

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

export interface ComboBoxItemType {
  value: string;
  label: string;
}

interface ComboboxProps {
  value?: string;
  label?: string;
  onSelect?: (value: string, label?: string) => void;
  items: ComboBoxItemType[];
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string | React.ReactNode;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  onSearchChange?: (e: string) => void;
  disabled?: boolean;
  selected?: string[];
  popoverSameWidthAsTrigger?: boolean;
  align?: (typeof ALIGN_OPTIONS)[number];
  popoverContentClassName?: string;
  total?: number;
  isLoading?: boolean;
}

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function SearchCombobox({
  value,
  label,
  onSelect,
  items,
  isLoading = false,
  searchPlaceholder = "Search item...",
  noResultsMsg = "No items found",
  selectItemMsg = "Select an item",
  className,
  unselect = false,
  unselectMsg = "None",
  onSearchChange,
  disabled = false,
  selected = [],
  popoverSameWidthAsTrigger = true,
  align,
  popoverContentClassName,
  total,
}: ComboboxProps) {
  const [open, setOpenState] = React.useState(false);

  const more = total ? total - items.length : 0;

  const handleOnSearchChange = useDebouncedCallback((e: string) => {
    onSearchChange?.(e);
  }, 100);

  function setOpen(isOpen: boolean) {
    if (!isOpen) handleOnSearchChange("");
    setOpenState(isOpen);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          <span className="flex items-center truncate">
            {label ?? selectItemMsg}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={popoverSameWidthAsTrigger ? popOverStyles : {}}
        className={cn("p-0", popoverContentClassName)}
        align={align}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleOnSearchChange}
          />
          <CommandList>
            {!isLoading && <CommandEmpty>{noResultsMsg}</CommandEmpty>}
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <CommandGroup>
                {unselect && (
                  <CommandItem
                    key="unselect"
                    value=""
                    onSelect={() => {
                      onSelect?.("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "" ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {unselectMsg}
                  </CommandItem>
                )}
                {items.map((item) => {
                  const isSelected =
                    value === item.value || selected.includes(item.value);
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      keywords={[item.label]}
                      onSelect={(value) => {
                        onSelect?.(value, item.label);
                        setOpen(false);
                      }}
                      disabled={isSelected}
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
          {!!more && (
            <div className="px-3 py-2.5 text-sm opacity-50">
              {more} additional options are hidden.
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
