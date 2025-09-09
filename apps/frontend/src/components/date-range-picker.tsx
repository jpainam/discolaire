/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { DateRange } from "react-day-picker";
import { useId, useState } from "react";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { cn } from "~/lib/utils";

export default function DateRangePicker({
  className,
  defaultValue,
  onSelectAction,
}: {
  className?: string;
  defaultValue?: DateRange;
  onSelectAction?: (date: DateRange | undefined) => void;
}) {
  const today = new Date();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  };
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  };
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  };
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  };
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  };
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  };
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  };
  const [month, setMonth] = useState(today);
  const id = useId();
  const [date, setDate] = useState<DateRange | undefined>(
    defaultValue ?? last7Days,
  );

  const handleSelected = (newDate: DateRange) => {
    if (onSelectAction) {
      onSelectAction(newDate);
      setOpen(false);
    }
  };

  const locale = useLocale();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
            className,
          )}
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              "Pick a date range"
            )}
          </span>
          <CalendarIcon
            size={16}
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex max-sm:flex-col">
          <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="h-full text-xs sm:border-e">
              <div className="flex flex-col px-0 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate({
                      from: today,
                      to: today,
                    });
                    setMonth(today);
                    handleSelected({ from: today, to: today });
                  }}
                >
                  {t("Today")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(yesterday);
                    setMonth(yesterday.to);
                    handleSelected(yesterday);
                  }}
                >
                  {t("Yesterday")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(last7Days);
                    setMonth(last7Days.to);
                    handleSelected(last7Days);
                  }}
                >
                  Last 7 days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(last30Days);
                    setMonth(last30Days.to);
                    handleSelected(last30Days);
                  }}
                >
                  Last 30 days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(monthToDate);
                    setMonth(monthToDate.to);
                    handleSelected(monthToDate);
                  }}
                >
                  Month to date
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(lastMonth);
                    setMonth(lastMonth.to);
                    handleSelected(lastMonth);
                  }}
                >
                  Last month
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(yearToDate);
                    setMonth(yearToDate.to);
                    handleSelected(yearToDate);
                  }}
                >
                  Year to date
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setDate(lastYear);
                    setMonth(lastYear.to);
                    handleSelected(lastYear);
                  }}
                >
                  {t("Last year")}
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            mode="range"
            locale={locale === "fr" ? fr : locale === "en" ? enUS : es}
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              if (onSelectAction) {
                onSelectAction(selectedDate);
                setOpen(false);
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
