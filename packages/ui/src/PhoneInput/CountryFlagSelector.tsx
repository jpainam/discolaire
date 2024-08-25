/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Country } from "react-phone-number-input/input";
import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";

import type { CountryOption } from ".";
import { cn } from "..";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { isoToEmoji } from "./PhoneInputHelpers";

//export type Option = Record<"value" | "label", string> & Record<string, string>;

interface ComboboxCountryInputProps {
  value: Country;
  onValueChange: (value: CountryOption) => void;
  options: CountryOption[];
  renderOption: ({
    option,
    isSelected,
  }: {
    option: CountryOption;
    isSelected: boolean;
  }) => React.ReactNode;
  renderValue: (option: CountryOption) => string;
  emptyMessage: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ComboboxCountryInput({
  value,
  onValueChange,
  options,
  disabled = false,
  renderOption,
  renderValue,
  placeholder,
  className,
  emptyMessage,
}: ComboboxCountryInputProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          variant={"outline"}
          className={cn(
            "flex gap-1 rounded-e-none rounded-s-lg pl-3 pr-1 text-2xl",
            className,
          )}
          // className="inline-flex items-center justify-between self-start rounded-md border border-stone-200 bg-white px-4 py-2 text-lg font-medium ring-offset-white transition-colors hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
        >
          {value ? isoToEmoji(value) : ""}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="mt-2 h-full max-h-48 overflow-auto p-0 [&_div[cmdk-group-items]]:flex [&_div[cmdk-group-items]]:flex-col [&_div[cmdk-group-items]]:gap-1">
              {options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    value={renderValue(option)}
                    onSelect={() => {
                      onValueChange(option);
                      setOpen(false);
                    }}
                  >
                    {renderOption({ option, isSelected: isSelected })}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
