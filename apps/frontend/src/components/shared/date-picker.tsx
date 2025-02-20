"use client";

import { useState } from "react";
import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { cn } from "~/lib/utils";

interface DatePickerProps {
  placeholder?: string;
  className?: string;
  fromYear?: number;
  disabled?: boolean;
  toYear?: number;
  formatStr?: string;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
}
export function DatePicker({
  placeholder,
  className,
  formatStr = "PPP",
  //toYear = 2050,
  onChange,
  disabled = false,
  //fromYear = 1930,
  defaultValue,
}: DatePickerProps) {
  const { i18n, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | undefined>(
    defaultValue ?? undefined,
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
            "w-full justify-start text-left font-normal",
            className,
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, formatStr, { locale: currentLocale })
          ) : (
            <span>{placeholder ?? t("pick_a_date")}</span>
          )}
          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={disabled}
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
            setValue(date);
          }}
          /*disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }*/

          //startMonth={new Date(fromYear, 0)}
          ///endMonth={new Date(toYear, 11)}
          locale={currentLocale}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
