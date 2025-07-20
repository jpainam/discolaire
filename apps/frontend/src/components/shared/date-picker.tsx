"use client";

import type { CaptionLabelProps, MonthGridProps } from "react-day-picker";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear,
} from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { useLocale } from "~/i18n";
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

  const [month, setMonth] = useState(defaultValue ?? new Date());
  const [date, setDate] = useState<Date | undefined>(defaultValue);
  const [isYearView, setIsYearView] = useState(false);
  const startDate = new Date(1980, 6);
  const endDate = new Date(2030, 6);

  const years = eachYearOfInterval({
    start: startOfYear(startDate),
    end: endOfYear(endDate),
  });

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
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, formatStr, { locale: currentLocale })
          ) : (
            <span>{placeholder ?? t("pick_a_date")}</span>
          )}
          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          disabled={disabled}
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
            setOpen(false);
          }}
          month={month}
          locale={currentLocale}
          autoFocus
          onMonthChange={setMonth}
          defaultMonth={new Date()}
          startMonth={startDate}
          endMonth={endDate}
          className="overflow-hidden rounded-md border p-2"
          classNames={{
            month_caption: "ms-2.5 me-20 justify-start",
            nav: "justify-end",
          }}
          components={{
            CaptionLabel: (props: CaptionLabelProps) => (
              <CaptionLabel
                isYearView={isYearView}
                setIsYearView={setIsYearView}
                {...props}
              />
            ),
            MonthGrid: (props: MonthGridProps) => {
              return (
                <MonthGrid
                  className={props.className}
                  isYearView={isYearView}
                  setIsYearView={setIsYearView}
                  startDate={startDate}
                  endDate={endDate}
                  years={years}
                  currentYear={month.getFullYear()}
                  currentMonth={month.getMonth()}
                  onMonthSelect={(selectedMonth: Date) => {
                    setMonth(selectedMonth);
                    setIsYearView(false);
                  }}
                >
                  {props.children}
                </MonthGrid>
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function MonthGrid({
  className,
  children,
  isYearView,
  startDate,
  endDate,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
}: {
  className?: string;
  children: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  years: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
}) {
  const currentYearRef = useRef<HTMLDivElement>(null);
  const currentMonthButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYearView && currentYearRef.current && scrollAreaRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      )!;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (viewport) {
        const yearTop = currentYearRef.current.offsetTop;
        viewport.scrollTop = yearTop;
      }
      setTimeout(() => {
        currentMonthButtonRef.current?.focus();
      }, 100);
    }
  }, [isYearView]);

  return (
    <div className="relative">
      <table className={className}>{children}</table>
      {isYearView && (
        <div className="bg-background absolute inset-0 z-20 -mx-2 -mb-2">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            {years.map((year) => {
              const months = eachMonthOfInterval({
                start: startOfYear(year),
                end: endOfYear(year),
              });
              const isCurrentYear = year.getFullYear() === currentYear;

              return (
                <div
                  key={year.getFullYear()}
                  ref={isCurrentYear ? currentYearRef : undefined}
                >
                  <CollapsibleYear
                    title={year.getFullYear().toString()}
                    open={isCurrentYear}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month) => {
                        const isDisabled =
                          isBefore(month, startDate) || isAfter(month, endDate);
                        const isCurrentMonth =
                          month.getMonth() === currentMonth &&
                          year.getFullYear() === currentYear;

                        return (
                          <Button
                            key={month.getTime()}
                            ref={
                              isCurrentMonth ? currentMonthButtonRef : undefined
                            }
                            variant={isCurrentMonth ? "default" : "outline"}
                            size="sm"
                            className="h-7"
                            disabled={isDisabled}
                            onClick={() => onMonthSelect(month)}
                          >
                            {format(month, "MMM")}
                          </Button>
                        );
                      })}
                    </div>
                  </CollapsibleYear>
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function CaptionLabel({
  children,
  isYearView,
  setIsYearView,
}: {
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Button
      className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
      variant="ghost"
      size="sm"
      onClick={() => setIsYearView((prev) => !prev)}
      data-state={isYearView ? "open" : "closed"}
    >
      {children}
      <ChevronDownIcon
        size={16}
        className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
        aria-hidden="true"
      />
    </Button>
  );
}

function CollapsibleYear({
  title,
  children,
  open,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <Collapsible className="border-t px-2 py-1.5" defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
          variant="ghost"
          size="sm"
        >
          <ChevronDownIcon
            size={16}
            className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
            aria-hidden="true"
          />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden px-3 py-1 text-sm transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
