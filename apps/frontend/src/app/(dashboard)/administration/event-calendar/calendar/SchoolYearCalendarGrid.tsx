"use client";

import { startOfWeek } from "date-fns";
import { useLocale } from "next-intl";

import { cn } from "~/lib/utils";
import { useSchoolYearCalendarContext } from "./SchoolYearCalendarContext";

export function SchoolYearCalendarGrid() {
  const locale = useLocale();
  const { filters, events, currentYear } = useSchoolYearCalendarContext();
  const startMonth = 8; // August
  const endMonth = 5; // May
  const generateMonths = () => {
    const monthsData = [];
    let currentMonth = startMonth;
    let yearOffset = 0;

    while (true) {
      const actualYear = currentYear + yearOffset;
      const monthName = new Date(2000, currentMonth, 1).toLocaleString(locale, {
        month: "long",
      });
      const daysInMonth = new Date(actualYear, currentMonth + 1, 0).getDate();
      //const firstDayOfWeek = getDayOfWeek(actualYear, currentMonth, 1);
      const firstDayOfWeek = startOfWeek(
        new Date(actualYear, currentMonth, 1),
        { weekStartsOn: 0 },
      ).getDay();

      // Generate calendar days
      const days = [];

      // Add empty cells for days before the 1st of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="border-border/50 bg-muted/20 h-16 border md:h-20"
          ></div>,
        );
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date1 = `${actualYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const date = new Date(actualYear, currentMonth, day);
        const dayEvents = events.filter(
          (event) => event.date === date && filters.includes(event.typeId),
        );

        days.push(
          <div
            key={date1}
            className="border-border/50 h-16 overflow-hidden border p-1 md:h-20"
          >
            <div className="text-xs font-medium">{day}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: event.type.color,
                  }}
                  className={cn("truncate rounded border px-1 py-0.5 text-xs")}
                  title={event.name}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </div>,
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

    return monthPairs;
  };
  const monthPairs = generateMonths();

  return (
    <div className="space-y-8">
      {monthPairs.map((pair, pairIndex) => (
        <div
          key={`pair-${pairIndex}`}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {pair.map((monthData) => (
            <div key={`${monthData?.year}-${monthData?.month}`}>
              <h2 className="mb-2 text-xl font-semibold capitalize">
                {monthData?.name} {monthData?.year}
              </h2>
              <div className="grid grid-cols-7 text-center">
                <div className="py-1 text-xs font-medium">Sun</div>
                <div className="py-1 text-xs font-medium">Mon</div>
                <div className="py-1 text-xs font-medium">Tue</div>
                <div className="py-1 text-xs font-medium">Wed</div>
                <div className="py-1 text-xs font-medium">Thu</div>
                <div className="py-1 text-xs font-medium">Fri</div>
                <div className="py-1 text-xs font-medium">Sat</div>
                {monthData?.days}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
