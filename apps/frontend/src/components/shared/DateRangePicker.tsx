"use client";

import type { DateRange } from "react-day-picker";
import * as React from "react";
import { addDays, format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { cn } from "~/lib/utils";

interface DatePickerProps {
  onChange?: (date: DateRange | undefined) => void;
  from?: Date;
  to?: Date;
  className?: string;
  placeholder?: string;
  numberOfMonths?: number;
  fromYear?: number;
  toYear?: number;
}
export function DateRangePicker({
  className,
  onChange,
  from,
  to,
  placeholder,
  fromYear = 1930,
  toYear = 2050,
  numberOfMonths = 2,
}: DatePickerProps) {
  const currentDate = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from ?? currentDate,
    to: to ?? addDays(from ?? currentDate, 15),
  });

  const [open, setOpen] = React.useState(false);

  const { i18n, t } = useLocale();

  const currentLocale = i18n.language.includes("en")
    ? enUS
    : i18n.language.includes("es")
      ? es
      : fr;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          size={"sm"}
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y", { locale: currentLocale })} -{" "}
                {format(date.to, "LLL dd, y", { locale: currentLocale })}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder ?? t("pick_a_date")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={currentLocale}
          autoFocus={true}
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
          }}
          numberOfMonths={numberOfMonths}
        />
      </PopoverContent>
    </Popover>
  );
}
