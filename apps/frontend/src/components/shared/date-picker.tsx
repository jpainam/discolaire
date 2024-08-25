"use client";

import { useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

type DatePickerProps = {
  placeholder?: string;
  className?: string;
  fromYear?: number;
  disabled?: boolean;
  toYear?: number;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
};
export function DatePicker({
  placeholder,
  className,
  toYear = 2050,
  onChange,
  disabled = false,
  fromYear = 1930,
  defaultValue,
}: DatePickerProps) {
  const { i18n, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | undefined>(
    defaultValue || undefined,
  );
  const currentLocale = i18n.language.includes("en")
    ? enUS
    : i18n.language.includes("es")
      ? es
      : fr;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full text-left font-normal",
            className,
            !value && "text-muted-foreground",
          )}
        >
          {value ? (
            format(value, "PPP", { locale: currentLocale })
          ) : defaultValue ? (
            format(defaultValue, "PPP", { locale: currentLocale })
          ) : (
            <span>{placeholder ?? t("pick_a_date")}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={disabled}
          selected={value}
          onSelect={(date) => {
            date && onChange && onChange(date);
            setOpen(false);
            setValue(date);
          }}
          /*disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }*/
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          locale={currentLocale}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
