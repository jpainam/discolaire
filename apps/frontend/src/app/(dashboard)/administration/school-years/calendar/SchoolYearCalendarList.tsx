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
}
