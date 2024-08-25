import * as React from "react";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Skeleton } from "@repo/ui/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import VirtualizedCommand from "./VirtualizedCommand";

type Option = {
  value: string;
  label: string;
  avatar?: string;
};

interface FormerSchoolSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function FormerSchoolSelector({
  searchPlaceholder,
  placeholder,
  className,
  height = "400px",
  onChange,
  defaultValue,
}: FormerSchoolSelectorProps) {
  const formerSchoolsQuery = api.school.formerSchools.useQuery();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: defaultValue ?? "",
  });
  const [options, setOptions] = React.useState<Option[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    if (formerSchoolsQuery.data) {
      if (defaultValue) {
        const dValue = formerSchoolsQuery.data?.find(
          (item) => item.id === defaultValue,
        );
        dValue && setSelectedOption({ label: dValue.name, value: dValue.id });
      }
      setOptions(
        formerSchoolsQuery.data?.map((item) => ({
          label: item.name,
          value: item.id,
          avatar: undefined,
        })),
      );
    }
  }, [defaultValue, formerSchoolsQuery.data]);

  if (formerSchoolsQuery.isPending) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between truncate", className)}
        >
          {selectedOption.value
            ? options.find((option) => option.value === selectedOption.value)
                ?.label
            : placeholder
              ? placeholder
              : t("select_an_option")}{" "}
          {""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" sameWidthAsTrigger={true}>
        <VirtualizedCommand
          height={height}
          renderOption={({ option, isSelected }) => {
            return (
              <>
                <div className="flex flex-row items-center gap-2">
                  {option?.label}
                </div>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </>
            );
          }}
          options={options.map((option) => ({
            value: option.value,
            label: option.label,
            avatar: option.avatar,
          }))}
          placeholder={searchPlaceholder ? searchPlaceholder : t("search")}
          selectedOption={selectedOption.value}
          onSelectOption={(currentValue) => {
            onChange &&
              onChange(
                currentValue === selectedOption.value ? null : currentValue,
              );
            setSelectedOption({
              value: currentValue === selectedOption.value ? "" : currentValue,
              label: "",
            });
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
