"use client";

import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { startOfWeek } from "date-fns";
import i18next from "i18next";
import { useSchoolYearCalendarContext } from "./SchoolYearCalendarContext";
import { SchoolYearCalendarHeader } from "./SchoolYearCalendarHeader";

const startMonth = 8; // August;
const endMonth = 5;
export function SchoolYearCalendar() {
  const { filters, events, currentYear, viewMode, eventTypes } =
    useSchoolYearCalendarContext();

  // Generate months for the school year
  const generateMonths = () => {
    const monthsData = [];
    let currentMonth = startMonth;
    let yearOffset = 0;

    while (true) {
      const actualYear = currentYear + yearOffset;
      const monthName = new Date(2000, currentMonth, 1).toLocaleString(
        i18next.language,
        {
          month: "long",
        }
      );
      const daysInMonth = new Date(actualYear, currentMonth + 1, 0).getDate();
      //const firstDayOfWeek = getDayOfWeek(actualYear, currentMonth, 1);
      const firstDayOfWeek = startOfWeek(
        new Date(actualYear, currentMonth, 1),
        { weekStartsOn: 0 }
      ).getDay();

      // Generate calendar days
      const days = [];

      // Add empty cells for days before the 1st of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="h-16 md:h-20 border border-border/50 bg-muted/20"
          ></div>
        );
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date1 = `${actualYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const date = new Date(actualYear, currentMonth, day);
        const dayEvents = events.filter(
          (event) => event.date === date && filters.includes(event.typeId)
        );

        days.push(
          <div
            key={date1}
            className="h-16 md:h-20 border border-border/50 p-1 overflow-hidden"
          >
            <div className="text-xs font-medium">{day}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: event.type.color,
                  }}
                  className={cn("text-xs rounded px-1 py-0.5 border truncate")}
                  title={event.name}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </div>
        );
      }

      monthsData.push({
        month: currentMonth,
        year: actualYear,
        name: monthName,
        days: days,
      });

      // Move to next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        yearOffset++;
      }

      // Break if we've reached the end of the school year
      if (yearOffset > 0 && currentMonth > endMonth) {
        break;
      }
    }

    // Group months in pairs for side-by-side display
    const monthPairs = [];
    for (let i = 0; i < monthsData.length; i += 2) {
      const pair = [monthsData[i]];
      if (i + 1 < monthsData.length) {
        pair.push(monthsData[i + 1]);
      }
      monthPairs.push(pair);
    }

    return (
      <div className="space-y-8">
        {monthPairs.map((pair, pairIndex) => (
          <div
            key={`pair-${pairIndex}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {pair.map((monthData) => (
              <div key={`${monthData?.year}-${monthData?.month}`}>
                <h2 className="mb-2 capitalize text-xl font-semibold">
                  {monthData?.name} {monthData?.year}
                </h2>
                <div className="grid grid-cols-7 text-center">
                  <div className="py-1 font-medium text-xs">Sun</div>
                  <div className="py-1 font-medium text-xs">Mon</div>
                  <div className="py-1 font-medium text-xs">Tue</div>
                  <div className="py-1 font-medium text-xs">Wed</div>
                  <div className="py-1 font-medium text-xs">Thu</div>
                  <div className="py-1 font-medium text-xs">Fri</div>
                  <div className="py-1 font-medium text-xs">Sat</div>
                  {monthData?.days}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Generate list view of events
  const generateEventsList = () => {
    // Filter events based on active filters and sort by date
    const filteredEvents = events
      .filter((event) => filters.includes(event.typeId))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div
              key={index}
              style={{
                backgroundColor: event.type.color,
              }}
              className={cn("p-4 rounded-lg border")}
            >
              <div className="font-semibold">{event.name}</div>
              <div className="text-sm">{formattedDate}</div>
              <div className="text-xs mt-1">{event.type.name}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 px-4">
      <SchoolYearCalendarHeader />

      <div className="rounded-lg border bg-card shadow">
        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <div key={type.id} className="flex items-center">
                <div
                  style={{
                    backgroundColor: type.color,
                  }}
                  className={cn("mr-1 h-3 w-3 rounded-sm")}
                ></div>
                <span className="text-xs">{type.name}</span>
              </div>
            ))}
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="pr-4">
              {viewMode === "calendar"
                ? generateMonths()
                : generateEventsList()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
