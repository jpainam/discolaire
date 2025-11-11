"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { CalendarEvent } from "~/components/event-calendar";
import { EventCalendar } from "~/components/event-calendar";
import { EventCalendarProvider } from "~/components/event-calendar/calendar-context";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { buildEventsByDayScan } from "./timetable-utils";

export function ClassroomTimetable() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    }),
  );
  const { schoolYear } = useSchool();

  const events = useMemo(
    () => buildEventsByDayScan(data, schoolYear.startDate, schoolYear.endDate),
    [data, schoolYear],
  );

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
    <EventCalendarProvider events={events}>
      <EventCalendar
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </EventCalendarProvider>
  );
}
