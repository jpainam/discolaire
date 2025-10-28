"use client";

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
  // Generate hours (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

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

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const getEventPosition = (event: Event) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = ((startHour - 6) * 60 + startMinute) * (80 / 60); // 80px per hour
    const height =
      ((endHour - startHour) * 60 + (endMinute - startMinute)) * (80 / 60);

    return { top, height };
  };

  const dayEvents = getEventsForDay();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="border-border bg-card mb-4 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h2>
        <p className="text-muted-foreground text-sm">
          {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}{" "}
          scheduled
        </p>
      </div>

      <div className="border-border flex flex-1 overflow-auto rounded-lg border">
        {/* Time column */}
        <div className="border-border bg-card w-24 flex-shrink-0 border-r">
          {hours.map((hour) => (
            <div key={hour} className="border-border h-20 border-b px-3 py-2">
              <span className="text-muted-foreground text-sm font-medium">
                {formatHour(hour)}
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
                  event.color,
                )}
                style={{ top: `${top}px`, height: `${height}px` }}
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
