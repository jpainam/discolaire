"use client";

import type { DateRange } from "react-day-picker";
import React, { useId } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { cn } from "~/lib/utils";

export function DateRangePicker({
  className,
  defaultValue,
  onSelectAction,
}: {
  className?: string;
  defaultValue?: DateRange;
  onSelectAction?: (date: DateRange | undefined) => void;
}) {
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);
  const id = useId();
  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const [open, setOpen] = React.useState(false);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultValue,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("w-full justify-between font-normal", className)}
        >
          <span
            className={cn("truncate", !dateRange && "text-muted-foreground")}
          >
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Pick a date range"
            )}
          </span>
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          timeZone={timeZone}
          defaultMonth={dateRange?.from}
          numberOfMonths={2}
          //className="rounded-lg border shadow-sm"
          onSelect={(daterange) => {
            setDateRange(daterange);
            setOpen(false);
            onSelectAction?.(daterange);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
