"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import { FormControl } from "@repo/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ScrollArea } from "@repo/ui/scroll-area";
import { t } from "i18next";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { getCountries } from "react-phone-number-input";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import countryNames from "react-phone-number-input/locale/en.json";

type CountryPickerFieldProps = {
  emptyPlaceholder?: React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  defaultValue?: string;
};
export function CountryPicker({
  emptyPlaceholder,
  searchPlaceholder,
  placeholder,
  className,
  onChange,
  disabled = false,
  defaultValue,
}: CountryPickerFieldProps) {
  const countries = useMemo(() => getCountries(), []);
  const [value, setValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            disabled={disabled}
            role="combobox"
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              className,
            )}
          >
            {value ? (
              <CountryComponent
                country={countries.find((country) => country === value)}
                countryName={countryNames[value as keyof typeof countryNames]}
              />
            ) : (
              (placeholder ?? t("select_an_option"))
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" sameWidthAsTrigger={true}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder ?? t("search_for_an_option")}
          />
          <CommandList>
            <CommandEmpty>{emptyPlaceholder ?? t("not_found")}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[250px] w-full">
                {countries.map((country) => (
                  <CommandItem
                    key={country}
                    onSelect={() => {
                      setValue(country);
                      onChange && onChange(country);
                      setOpen(false);
                    }}
                  >
                    <CountryComponent
                      country={country}
                      countryName={countryNames[country]}
                    />
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        country === value ? "opacity-100" : "opacity-0",
                      )}
                    />
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

const CountryComponent = ({
  country,
  countryName,
  className,
}: {
  country?: RPNInput.Country;
  countryName?: string;
  className?: string;
}) => {
  const Flag = country && flags[country];

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 text-xs",
        className,
      )}
    >
      <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
        {Flag && <Flag title={countryName ?? ""} />}
      </span>
      <span>
        {countryName ? countryName : country ? countryNames[country] : ""}
      </span>
    </div>
  );
};
CountryComponent.displayName = "CountryComponent";
export { CountryComponent };
