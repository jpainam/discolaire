"use client";

import { cn } from "@repo/ui/lib/utils";

import { useSchoolYearCalendarContext } from "./SchoolYearCalendarContext";

export function SchoolYearCalendarList() {
  const { events, filters } = useSchoolYearCalendarContext();
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
            className={cn("rounded-lg border p-4")}
          >
            <div className="font-semibold">{event.name}</div>
            <div className="text-sm">{formattedDate}</div>
            <div className="mt-1 text-xs">{event.type.name}</div>
          </div>
        );
      })}
    </div>
  );
}
