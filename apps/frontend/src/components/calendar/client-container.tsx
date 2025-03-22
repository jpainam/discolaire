"use client";

import { isSameDay, parseISO } from "date-fns";
import { useMemo } from "react";

import { useCalendar } from "~/components/calendar/calendar-context";

import { CalendarHeader } from "~/components/calendar/header/calendar-header";
import { CalendarMonthView } from "~/components/calendar/month-view/calendar-month-view";
import { CalendarDayView } from "~/components/calendar/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "~/components/calendar/week-and-day-view/calendar-week-view";

export function ClientContainer() {
  const { selectedDate, view, selectedUserId, events } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const itemStartDate = new Date(event.startDate);
      const itemEndDate = new Date(event.endDate);

      const monthStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      const monthEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      );

      const isInSelectedMonth =
        itemStartDate <= monthEnd && itemEndDate >= monthStart;
      const isUserMatch =
        selectedUserId === "all" || event.user.id === selectedUserId;
      return isInSelectedMonth && isUserMatch;
    });
  }, [selectedDate, selectedUserId, events]);

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  return (
    <div className="rounded-xl border">
      <CalendarHeader events={filteredEvents} />
      {view === "month" && (
        <CalendarMonthView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
      {view === "week" && (
        <CalendarWeekView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
      {view === "day" && (
        <CalendarDayView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
    </div>
  );
}
