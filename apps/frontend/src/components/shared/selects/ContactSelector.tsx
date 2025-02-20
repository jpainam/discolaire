import * as React from "react";
import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Skeleton } from "@repo/ui/components/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import VirtualizedCommand from "./VirtualizedCommand";

interface Option {
  value: string;
  label: string;
  avatar?: string;
}

interface ContactSelectorProps {
  searchPlaceholder?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string | null | undefined) => void;
}

export function ContactSelector({
  searchPlaceholder,
  placeholder,
  className,
  height = "400px",
  onChange,
  defaultValue,
}: ContactSelectorProps) {
  const contactSelectorQuery = api.contact.selector.useQuery();

  const contacts = contactSelectorQuery.data;

  const [open, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: defaultValue ?? "",
  });
  const [options, setOptions] = React.useState<Option[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    if (contacts) {
      if (defaultValue) {
        const dValue = contacts.find((item) => item.id === defaultValue);
        if (dValue)
          setSelectedOption({ label: getFullName(dValue), value: dValue.id });
      }
      setOptions(
        contacts.map((contact) => ({
          label: getFullName(contact),
          value: contact.id,
          avatar: contact.avatar ?? undefined,
        })),
      );
    }
  }, [defaultValue, contacts]);

  if (contactSelectorQuery.isPending) {
    return <Skeleton className={cn("h-8 w-full", className)} />;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[400px] justify-between", className)}
        >
          {selectedOption.value
            ? options.find((option) => option.value === selectedOption.value)
                ?.label
            : (placeholder ?? t("select_an_option"))}{" "}
          {""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 justify-end opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" sameWidthAsTrigger={true}>
        <VirtualizedCommand
          height={height}
          options={options.map((option) => ({
            value: option.value,
            label: option.label,
            avatar: option.avatar,
          }))}
          placeholder={searchPlaceholder ?? t("search")}
          selectedOption={selectedOption.value}
          onSelectOption={(currentValue) => {
            onChange?.(
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
