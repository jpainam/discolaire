"use client";

import { ChangeEventHandler, useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Input } from "@repo/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { cn } from "~/lib/utils";

type DateTimePickerProps = {
  placeholder?: string;
  className?: string;
  fromYear?: number;
  disabled?: boolean;
  toYear?: number;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
};
export function DateTimePicker({
  placeholder,
  className,
  toYear = 2050,
  onChange,
  disabled = false,
  fromYear = 1930,
  defaultValue,
}: DateTimePickerProps) {
  const { i18n, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [timeValue, setTimeValue] = useState<string>("00:00");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultValue || undefined,
  );

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!time || !selectedDate) {
      return;
    }

    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(selectedDate, minutes), hours);
    setSelectedDate(newSelectedDate);
    if (onChange) {
      onChange(newSelectedDate);
    }
    setTimeValue(time);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      setSelectedDate(date);
      return;
    }
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );

    setSelectedDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

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
            !selectedDate && "text-muted-foreground",
          )}
        >
          {selectedDate ? (
            format(selectedDate, "PPPpp", { locale: currentLocale })
          ) : defaultValue ? (
            format(defaultValue, "PPPpp", { locale: currentLocale })
          ) : (
            <span>{placeholder ?? t("pick_a_date")}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto flex-row items-start p-0"
        align="start"
      >
        <Calendar
          mode="single"
          disabled={disabled}
          selected={selectedDate}
          onSelect={handleDaySelect}
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          locale={currentLocale}
          initialFocus
        />
        <div className="p-2">
          <Input
            type="time"
            className="pr-2"
            value={timeValue}
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
