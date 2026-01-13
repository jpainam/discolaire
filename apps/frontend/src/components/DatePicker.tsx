"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { enUS, es, fr } from "react-day-picker/locale";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export function DatePicker({
  className,
  onSelectAction,
  defaultValue,
  dateOnly = true,
}: {
  className?: string;
  defaultValue?: Date;
  onSelectAction?: (val: Date | undefined) => void;
  dateOnly?: boolean;
}) {
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  //const [today] = React.useState(() => new Date())
  const locale = useLocale();
  const normalizedDefaultValue = useMemo(() => {
    if (!defaultValue) {
      return undefined;
    }
    if (!dateOnly) {
      return defaultValue;
    }
    return new Date(
      Date.UTC(
        defaultValue.getUTCFullYear(),
        defaultValue.getUTCMonth(),
        defaultValue.getUTCDate(),
        12,
      ),
    );
  }, [dateOnly, defaultValue]);

  const [date, setDate] = useState<Date | undefined>(normalizedDefaultValue);

  useEffect(() => {
    setDate(normalizedDefaultValue);
  }, [normalizedDefaultValue]);
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  const id = useId();
  const t = useTranslations();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className={cn("w-full justify-between font-normal", className)}
        >
          {date
            ? date.toLocaleDateString(locale, {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : t("Select date")}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          //defaultMonth={today.getMonth()}
          selected={date}
          defaultMonth={date ?? normalizedDefaultValue ?? new Date()}
          endMonth={new Date(2050, 0)}
          locale={locale == "fr" ? fr : locale == "en" ? enUS : es}
          captionLayout="dropdown"
          timeZone={timeZone}
          onSelect={(date) => {
            if (!date || !dateOnly) {
              setDate(date);
              onSelectAction?.(date);
              setOpen(false);
              return;
            }
            const normalized = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12),
            );
            setDate(normalized);
            setOpen(false);
            onSelectAction?.(normalized);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
