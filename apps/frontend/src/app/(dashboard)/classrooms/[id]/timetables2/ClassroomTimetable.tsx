"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addDays, startOfWeek } from "date-fns";

import type { RouterOutputs } from "@repo/api";

import type { CalendarEvent, EventColor } from "~/components/event-calendar";
import { EventCalendar } from "~/components/event-calendar";
import { useTRPC } from "~/trpc/react";

export function ClassroomTimetable() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    }),
  );
  const [today] = useState(() => new Date());
  const events = useMemo(() => buildWeekEvents(data, today), [data, today]);
  //const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    console.log(event);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    console.log(updatedEvent);
  };

  const handleEventDelete = (eventId: string) => {
    console.log(eventId);
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}

function parseTimeStr(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

export function buildWeekEvents(
  recurringRows: RouterOutputs["subjectTimetable"]["byClassroom"],
  weekAnchor: Date,
) {
  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 0 });

  const colors: EventColor[] = [
    "sky",
    "amber",
    "violet",
    "rose",
    "emerald",
    "orange",
  ];

  const colorMap = new Map<string, EventColor>();
  let colorIndex = 0;

  return recurringRows.map((row) => {
    const { hour: startHour, minute: startMinute } = parseTimeStr(row.start);
    const { hour: endHour, minute: endMinute } = parseTimeStr(row.end);

    const dayDate = addDays(weekStart, row.weekday);

    const eventStart = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      startHour,
      startMinute,
    );

    const eventEnd = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      endHour,
      endMinute,
    );

    if (!colorMap.has(row.subject.course.id)) {
      const c = colors[colorIndex % colors.length] ?? "sky";
      colorMap.set(row.subject.course.id, c);
      colorIndex++;
    }

    return {
      id: String(row.id),
      title: row.subject.course.shortName,
      description: "",
      start: eventStart,
      end: eventEnd,
      allDay: false,
      color: colorMap.get(row.subject.course.id),
    };
  });
}
