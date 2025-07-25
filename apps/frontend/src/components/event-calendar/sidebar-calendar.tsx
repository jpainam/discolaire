"use client";

import { useEffect, useState } from "react";

import { Calendar } from "@repo/ui/components/calendar";
import { cn } from "@repo/ui/lib/utils";

import { useCalendarContext } from "~/components/event-calendar/calendar-context";

interface SidebarCalendarProps {
  className?: string;
}

export default function SidebarCalendar({ className }: SidebarCalendarProps) {
  // Use the shared calendar context
  const { currentDate, setCurrentDate } = useCalendarContext();

  // Track the month to display in the calendar
  const [calendarMonth, setCalendarMonth] = useState<Date>(currentDate);

  // Update the calendar month whenever currentDate changes
  useEffect(() => {
    setCalendarMonth(currentDate);
  }, [currentDate]);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={handleSelect}
        month={calendarMonth}
        onMonthChange={setCalendarMonth}
        classNames={{
          day_button:
            "transition-none! hover:not-in-data-selected:bg-sidebar-accent group-[.range-middle]:group-data-selected:bg-sidebar-accent text-sidebar-foreground",
          today: "*:after:transition-none",
          outside: "data-selected:bg-sidebar-accent/50",
        }}
      />
    </div>
  );
}
