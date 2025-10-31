"use client";

import { useLocale } from "next-intl";

import { Label } from "@repo/ui/components/label";

import { cn } from "~/lib/utils";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
}

export function DayView({ currentDate, events }: DayViewProps) {
  // Generate hours (7 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 7);

  const getEventsForDay = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };
  const locale = useLocale();

  const formatHour = (hour: number, locale: string) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      //hour12: true,
    }).format(date);
  };

  const getEventPosition = (event: Event) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = ((startHour - 7) * 60 + startMinute) * (62 / 60); // 80px per hour
    const height =
      ((endHour - startHour) * 60 + (endMinute - startMinute)) * (62 / 60);

    return { top, height };
  };

  const dayEvents = getEventsForDay();

  return (
    <div className="flex flex-col">
      <div className="border-b p-4">
        <Label className="text-lg font-semibold">
          {currentDate.toLocaleDateString(locale, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Label>
        <p className="text-muted-foreground text-sm">
          {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}{" "}
          scheduled
        </p>
      </div>

      <div className="border-border flex flex-1 overflow-auto rounded-lg">
        {/* Time column */}
        <div className="border-border w-24 flex-shrink-0 border-r">
          {hours.map((hour) => (
            <div key={hour} className="border-border h-20 border-b px-3 py-2">
              <span className="text-muted-foreground text-sm font-medium">
                {formatHour(hour, locale)}
              </span>
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="bg-card relative flex-1">
          {hours.map((hour) => (
            <div key={hour} className="border-border h-20 border-b" />
          ))}

          {/* Events */}
          {dayEvents.map((event) => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                className={cn(
                  "absolute right-4 left-4 rounded-lg p-3 text-white shadow-md",
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  backgroundColor: event.color,
                }}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="mt-1 text-sm opacity-90">
                  {event.start.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {event.end.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
