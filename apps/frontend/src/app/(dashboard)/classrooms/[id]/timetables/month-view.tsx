"use client";

import { useLocale } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn, getWeekdayName } from "~/lib/utils";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
}

export function MonthView({ currentDate, events }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  //const t = useTranslations();
  const locale = useLocale();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      fullDate: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      fullDate: new Date(year, month, i),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      fullDate: new Date(year, month + 1, i),
    });
  }

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

  const weekDays = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col">
      {/* Week day headers */}
      <div className="mb-2 grid grid-cols-7 gap-px">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground py-2 text-center text-sm font-medium capitalize"
          >
            {getWeekdayName(day, locale)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="border-border bg-border grid flex-1 grid-cols-7 gap-px border-y">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day.fullDate);
          const today = isToday(day.fullDate);

          return (
            <div
              key={index}
              className={cn(
                "bg-card min-h-[120px] p-2",
                !day.isCurrentMonth && "bg-muted/50",
                //index < 7 && "rounded-tl-lg rounded-tr-lg",
                //index >= days.length - 7 && "rounded-br-lg rounded-bl-lg",
              )}
            >
              <div
                className={cn(
                  "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  today && "bg-primary text-primary-foreground font-semibold",
                  !day.isCurrentMonth && "text-muted-foreground",
                )}
              >
                {day.date}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    style={{
                      backgroundColor: event.color,
                    }}
                    className={cn(
                      "truncate rounded px-2 py-1 text-xs font-medium text-white",
                      //event.color,
                    )}
                  >
                    {event.start.toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {event.end.toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <Popover>
                    <PopoverTrigger>
                      <div className="text-muted-foreground px-2 text-xs">
                        +{dayEvents.length - 3} de plus...
                      </div>
                    </PopoverTrigger>
                    <PopoverContent>
                      {dayEvents.map((event, index) => {
                        return (
                          <div
                            key={index}
                            className={cn(
                              "flex flex-row items-center justify-between truncate rounded px-2 py-1 text-xs font-medium",
                            )}
                          >
                            <div>
                              {event.start.toLocaleTimeString(locale, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {event.end.toLocaleTimeString(locale, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                            </div>
                            <div>{event.title}</div>
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
