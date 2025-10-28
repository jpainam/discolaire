"use client";

import { cn } from "~/lib/utils";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

export function WeekView({ currentDate, events }: WeekViewProps) {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // Generate hours (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
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

    const top = ((startHour - 6) * 60 + startMinute) * (64 / 60); // 64px per hour
    const height =
      ((endHour - startHour) * 60 + (endMinute - startMinute)) * (64 / 60);

    return { top, height };
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="border-border flex flex-1 overflow-auto rounded-lg border">
        {/* Time column */}
        <div className="border-border bg-card w-20 flex-shrink-0 border-r">
          <div className="border-border h-16 border-b" />
          {hours.map((hour) => (
            <div key={hour} className="border-border h-16 border-b px-2 py-1">
              <span className="text-muted-foreground text-xs">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex flex-1">
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const today = isToday(day);

            return (
              <div
                key={dayIndex}
                className="border-border flex-1 border-r last:border-r-0"
              >
                {/* Day header */}
                <div className="border-border bg-card flex h-16 flex-col items-center justify-center border-b">
                  <div className="text-muted-foreground text-xs font-medium">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      today && "bg-primary text-primary-foreground",
                    )}
                  >
                    {day.getDate()}
                  </div>
                </div>

                {/* Time slots */}
                <div className="bg-card relative">
                  {hours.map((hour) => (
                    <div key={hour} className="border-border h-16 border-b" />
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => {
                    const { top, height } = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute right-1 left-1 rounded px-2 py-1 text-xs font-medium text-white",
                          event.color,
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {event.start.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
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
