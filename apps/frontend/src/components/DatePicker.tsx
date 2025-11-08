"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { enUS, es, fr } from "react-day-picker/locale";

import { Button } from "@repo/ui/components//button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { cn } from "~/lib/utils";

export function DatePicker({
  className,
  onSelectAction,
  defaultValue,
}: {
  className?: string;
  defaultValue: Date | undefined;
  onSelectAction?: (val: Date | undefined) => void;
}) {
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  const id = React.useId();

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
            : "Select date"}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          locale={locale == "fr" ? fr : locale == "en" ? enUS : es}
          captionLayout="dropdown"
          timeZone={timeZone}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
            onSelectAction?.(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
