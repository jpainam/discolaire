"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ViewMode = "month" | "day" | "agenda";

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  endTime: string;
  room: string;
  type: "class" | "meeting" | "break" | "prep";
  day: number;
  month: number;
  year: number;
}

const scheduleEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Algebra II - 10A",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "2",
    title: "Geometry - 9B",
    time: "09:00",
    endTime: "09:50",
    room: "Room 204",
    type: "class",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "3",
    title: "Prep Period",
    time: "10:00",
    endTime: "10:50",
    room: "Office",
    type: "prep",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "4",
    title: "Calculus AP - 12A",
    time: "11:00",
    endTime: "11:50",
    room: "Room 301",
    type: "class",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "5",
    title: "Lunch Break",
    time: "12:00",
    endTime: "12:50",
    room: "",
    type: "break",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "6",
    title: "Pre-Calculus - 11B",
    time: "13:00",
    endTime: "13:50",
    room: "Room 204",
    type: "class",
    day: 23,
    month: 0,
    year: 2026,
  },
  {
    id: "7",
    title: "Department Meeting",
    time: "14:00",
    endTime: "15:00",
    room: "Conference Room A",
    type: "meeting",
    day: 23,
    month: 0,
    year: 2026,
  },

  {
    id: "8",
    title: "Algebra II - 10A",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 24,
    month: 0,
    year: 2026,
  },
  {
    id: "9",
    title: "Statistics - 11A",
    time: "09:00",
    endTime: "09:50",
    room: "Room 204",
    type: "class",
    day: 24,
    month: 0,
    year: 2026,
  },
  {
    id: "10",
    title: "Parent Conference",
    time: "10:00",
    endTime: "10:30",
    room: "Office",
    type: "meeting",
    day: 24,
    month: 0,
    year: 2026,
  },
  {
    id: "11",
    title: "Calculus AP - 12A",
    time: "11:00",
    endTime: "11:50",
    room: "Room 301",
    type: "class",
    day: 24,
    month: 0,
    year: 2026,
  },

  {
    id: "12",
    title: "Geometry - 9B",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 27,
    month: 0,
    year: 2026,
  },
  {
    id: "13",
    title: "Algebra II - 10A",
    time: "09:00",
    endTime: "09:50",
    room: "Room 204",
    type: "class",
    day: 27,
    month: 0,
    year: 2026,
  },
  {
    id: "14",
    title: "Staff Meeting",
    time: "15:00",
    endTime: "16:00",
    room: "Auditorium",
    type: "meeting",
    day: 27,
    month: 0,
    year: 2026,
  },

  {
    id: "15",
    title: "Pre-Calculus - 11B",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 28,
    month: 0,
    year: 2026,
  },
  {
    id: "16",
    title: "Calculus AP - 12A",
    time: "10:00",
    endTime: "10:50",
    room: "Room 301",
    type: "class",
    day: 28,
    month: 0,
    year: 2026,
  },

  {
    id: "17",
    title: "Algebra II - 10A",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 29,
    month: 0,
    year: 2026,
  },
  {
    id: "18",
    title: "Geometry - 9B",
    time: "09:00",
    endTime: "09:50",
    room: "Room 204",
    type: "class",
    day: 29,
    month: 0,
    year: 2026,
  },
  {
    id: "19",
    title: "Grade Review Meeting",
    time: "14:00",
    endTime: "15:00",
    room: "Conference Room B",
    type: "meeting",
    day: 29,
    month: 0,
    year: 2026,
  },

  {
    id: "20",
    title: "Statistics - 11A",
    time: "08:00",
    endTime: "08:50",
    room: "Room 204",
    type: "class",
    day: 30,
    month: 0,
    year: 2026,
  },
  {
    id: "21",
    title: "Calculus AP - 12A",
    time: "11:00",
    endTime: "11:50",
    room: "Room 301",
    type: "class",
    day: 30,
    month: 0,
    year: 2026,
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventTypeStyles = {
  class: "bg-primary/10 text-primary border-l-primary",
  meeting: "bg-accent/10 text-accent border-l-accent",
  break: "bg-muted text-muted-foreground border-l-muted-foreground",
  prep: "bg-chart-3/10 text-chart-3 border-l-chart-3",
};

export function StaffTimetable() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23));
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 23));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date(2026, 0, 23);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getEventsForDay = (
    day: number,
    m: number = month,
    y: number = year,
  ) => {
    return scheduleEvents.filter(
      (event) => event.day === day && event.month === m && event.year === y,
    );
  };

  const isToday = (day: number) => {
    const today = new Date(2026, 0, 23);
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const renderMonthView = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-muted/30 min-h-28 p-2" />,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isWeekend =
        (startingDayOfWeek + day - 1) % 7 === 0 ||
        (startingDayOfWeek + day - 1) % 7 === 6;

      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDate(new Date(year, month, day));
            setViewMode("day");
          }}
          className={cn(
            "hover:bg-muted/50 focus:ring-primary min-h-28 p-2 text-left transition-colors focus:ring-2 focus:outline-none focus:ring-inset",
            isWeekend && "bg-muted/20",
            isSelected(day) && "ring-primary ring-2 ring-inset",
          )}
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
              isToday(day) && "bg-primary text-primary-foreground",
            )}
          >
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "truncate rounded border-l-2 px-1.5 py-0.5 text-xs",
                  eventTypeStyles[event.type],
                )}
              >
                {event.time} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <p className="text-muted-foreground px-1.5 text-xs">
                +{dayEvents.length - 3} more
              </p>
            )}
          </div>
        </button>,
      );
    }

    return days;
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(
      selectedDate.getDate(),
      selectedDate.getMonth(),
      selectedDate.getFullYear(),
    );

    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

    return (
      <div className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedDate(new Date(selectedDate.getTime() - 86400000))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedDate(new Date(selectedDate.getTime() + 86400000))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="border-border flex border-t">
              <div className="text-muted-foreground w-20 flex-shrink-0 py-4 pr-4 text-right text-sm">
                {hour > 12
                  ? `${hour - 12}:00 PM`
                  : hour === 12
                    ? "12:00 PM"
                    : `${hour}:00 AM`}
              </div>
              <div className="relative min-h-16 flex-1">
                {dayEvents
                  .filter((event) => {
                    const eventHour = parseInt(event.time.split(":")[0] ?? "0");
                    return eventHour === hour;
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute right-2 left-2 rounded-lg border-l-4 p-3 shadow-sm",
                        eventTypeStyles[event.type],
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm opacity-80">
                            {event.time} - {event.endTime}
                          </p>
                          {event.room && (
                            <p className="text-sm opacity-70">{event.room}</p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    // Get events for next 14 days
    const agendaDays: { date: Date; events: ScheduleEvent[] }[] = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      const events = getEventsForDay(
        date.getDate(),
        date.getMonth(),
        date.getFullYear(),
      );
      if (events.length > 0) {
        agendaDays.push({ date, events });
      }
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Upcoming Schedule</h3>

        {agendaDays.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            No scheduled events for the next 14 days
          </div>
        ) : (
          agendaDays.map(({ date, events }) => (
            <div key={date.toISOString()} className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded-lg",
                    isToday(date.getDate()) && date.getMonth() === month
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <span className="text-xs uppercase">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                </div>
                <div>
                  <p className="font-medium">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {events.length} event{events.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="border-border ml-6 space-y-2 border-l-2 pl-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg border-l-4 p-4 shadow-sm",
                      eventTypeStyles[event.type],
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm opacity-80">
                          {event.time} - {event.endTime}
                        </p>
                        {event.room && (
                          <p className="text-sm opacity-70">{event.room}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Month
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("day")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Day
          </Button>
          <Button
            variant={viewMode === "agenda" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("agenda")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Agenda
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="border-border bg-card rounded-xl border shadow-sm">
        {viewMode === "month" && (
          <>
            <div className="border-border grid grid-cols-7 border-b">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-muted-foreground py-3 text-center text-sm font-medium"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="divide-border grid grid-cols-7 divide-x divide-y">
              {renderMonthView()}
            </div>
          </>
        )}

        {viewMode === "day" && <div className="p-6">{renderDayView()}</div>}

        {viewMode === "agenda" && (
          <div className="p-6">{renderAgendaView()}</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 border-primary h-3 w-3 rounded-sm border-l-2" />
          <span>Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-accent/20 border-accent h-3 w-3 rounded-sm border-l-2" />
          <span>Meeting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-chart-3/20 border-chart-3 h-3 w-3 rounded-sm border-l-2" />
          <span>Prep</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted border-muted-foreground h-3 w-3 rounded-sm border-l-2" />
          <span>Break</span>
        </div>
      </div>
    </div>
  );
}
