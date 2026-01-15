"use client";

import type { DateRange } from "react-day-picker";
import React, { useId } from "react";
import {
  endOfMonth,
  endOfYesterday,
  format,
  startOfMonth,
  startOfToday,
  startOfYesterday,
  subDays,
} from "date-fns";
import { ArrowRight, CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface PresetRange {
  label: string;
  getValue: () => DateRange;
}

const presetRanges: PresetRange[] = [
  {
    label: "Custom",
    getValue: () => ({ from: undefined, to: undefined }),
  },
  {
    label: "Today",
    getValue: () => {
      const today = startOfToday();
      return { from: today, to: today };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = startOfYesterday();
      return { from: yesterday, to: endOfYesterday() };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = new Date();
      return { from: subDays(today, 6), to: today };
    },
  },
  {
    label: "Last 28 Days",
    getValue: () => {
      const today = new Date();
      return { from: subDays(today, 27), to: today };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      return { from: subDays(today, 29), to: today };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const today = new Date();
      return { from: startOfMonth(today), to: endOfMonth(today) };
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    },
  },
];

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
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null,
  );

  const handlePresetClick = (preset: PresetRange) => {
    setSelectedPreset(preset.label);
    if (preset.label !== "Custom") {
      setDateRange(preset.getValue());
    }
  };

  const handleApply = () => {
    setOpen(false);
    onSelectAction?.(dateRange);
  };

  const handleCancel = () => {
    setDateRange(defaultValue);
    setOpen(false);
  };

  const calculateDaysSelected = () => {
    if (!dateRange?.from || !dateRange.to) return 0;
    const diffTime = Math.abs(
      dateRange.to.getTime() - dateRange.from.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

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
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[550px] p-0 sm:max-w-5xl">
        <div className="flex">
          {/* Quick Select Sidebar */}
          <div className="bg-muted/50 w-64 space-y-2 border-r p-2">
            <Label className="m-1 mb-5">Quick Select</Label>
            {presetRanges.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "w-full rounded-md p-1 text-left text-xs transition-colors",
                  selectedPreset === preset.label
                    ? "border-primary bg-secondary text-foreground border-1"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar Section */}
          <div className="flex-1 px-2 py-4">
            {/* Date Inputs */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <Label className="text-muted-foreground font-medium tracking-wide uppercase">
                  From
                </Label>
                <Input
                  value={
                    dateRange?.from
                      ? format(dateRange.from, "MMM dd, yyyy")
                      : ""
                  }
                  readOnly
                  placeholder="Select start date"
                />
              </div>
              <ArrowRight className="text-muted-foreground mt-6 h-5 w-5" />
              <div className="flex flex-1 flex-col gap-2">
                <Label className="text-muted-foreground font-medium tracking-wide uppercase">
                  To
                </Label>
                <Input
                  value={
                    dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : ""
                  }
                  readOnly
                  placeholder="Select end date"
                />
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              selected={dateRange}
              timeZone={timeZone}
              defaultMonth={dateRange?.from}
              numberOfMonths={2}
              onSelect={(range) => {
                setDateRange(range);
                setSelectedPreset("Custom");
              }}
            />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                {calculateDaysSelected()}{" "}
                {calculateDaysSelected() === 1 ? "day" : "days"} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleApply}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
