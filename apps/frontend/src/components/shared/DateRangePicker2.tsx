"use client";

import type { DateRange } from "react-day-picker";
import {
  formatISO,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { formatDateRange } from "little-date";
import { ChevronDown } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

interface Props {
  defaultValue: {
    to: string;
    from: string;
  };
  onChange?: (range: { from: Date; to: Date }) => void;
  disabled?: string;
}

const periods = [
  {
    value: "4w",
    label: "Last 4 weeks",
    range: {
      from: subWeeks(new Date(), 4),
      to: new Date(),
    },
  },
  {
    value: "3m",
    label: "Last 3 months",
    range: {
      from: subMonths(new Date(), 3),
      to: new Date(),
    },
  },
  {
    value: "12m",
    label: "Last 12 months",
    range: {
      from: subMonths(new Date(), 12),
      to: new Date(),
    },
  },
  {
    value: "mtd",
    label: "Month to date",
    range: {
      from: startOfMonth(new Date()),
      to: new Date(),
    },
  },
  {
    value: "ytd",
    label: "Year to date",
    range: {
      from: startOfYear(new Date()),
      to: new Date(),
    },
  },
  {
    value: "all",
    label: "All time",
    range: {
      // Can't get older data than this
      from: new Date("2020-01-01"),
      to: new Date(),
    },
  },
];
export function DateRangePicker({ defaultValue, disabled, onChange }: Props) {
  const [params, setParams] = useQueryStates(
    {
      from: parseAsString.withDefault(defaultValue.from),
      to: parseAsString.withDefault(defaultValue.to),
      period: parseAsString,
    },
    {
      shallow: false,
    },
  );

  const handleChangePeriod = (
    range: { from: Date | null; to: Date | null } | undefined,
    period?: string,
  ) => {
    if (!range) return;

    const newRange = {
      from: range.from
        ? formatISO(range.from, { representation: "date" })
        : params.from,
      to: range.to
        ? formatISO(range.to, { representation: "date" })
        : params.to,
      period,
    };

    void setParams(newRange);
    onChange?.({ from: newRange.from, to: newRange.to });
  };

  return (
    <div className="flex space-x-4">
      <Popover>
        <PopoverTrigger asChild disabled={Boolean(disabled)}>
          <Button
            variant="outline"
            className="justify-start space-x-2 text-left font-medium"
          >
            <span className="line-clamp-1 text-ellipsis">
              {formatDateRange(new Date(params.from), new Date(params.to), {
                includeTime: false,
              })}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex w-screen flex-col space-y-4 p-0 md:w-[550px]"
          align="end"
          sideOffset={10}
        >
          <div className="p-4 pb-0">
            <Select
              defaultValue={params.period ?? undefined}
              onValueChange={(value) =>
                handleChangePeriod(
                  periods.find((p) => p.value === value)?.range,
                  value,
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="range"
            numberOfMonths={2}
            today={params.from ? new Date(params.from) : new Date()}
            selected={
              {
                from: params.from && new Date(params.from),
                to: params.to && new Date(params.to),
              } as DateRange
            }
            defaultMonth={
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
            autoFocus={true}
            onSelect={(date) => {
              //setDate(date);
              handleChangePeriod({
                from: date?.from ?? null,
                to: date?.to ?? null,
              });
              onChange?.({
                from: date?.from ? new Date(date.from) : subDays(new Date(), 7),
                to: date?.to ? new Date(date.to) : new Date(),
              });
            }}
            //onSelect={handleChangePeriod}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
