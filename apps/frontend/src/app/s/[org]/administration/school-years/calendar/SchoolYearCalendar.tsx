"use client";

import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";

import { useSchoolYearCalendarContext } from "./SchoolYearCalendarContext";
import { SchoolYearCalendarGrid } from "./SchoolYearCalendarGrid";
import { SchoolYearCalendarHeader } from "./SchoolYearCalendarHeader";
import { SchoolYearCalendarList } from "./SchoolYearCalendarList";

export function SchoolYearCalendar() {
  const { viewMode, eventTypes } = useSchoolYearCalendarContext();

  return (
    <div className="space-y-4 px-4">
      <SchoolYearCalendarHeader />

      <div className="bg-card rounded-lg border shadow">
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
              {viewMode === "calendar" ? (
                <SchoolYearCalendarGrid />
              ) : (
                <SchoolYearCalendarList />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
