"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useTRPC } from "~/trpc/react";

export function ClassroomTimetablesCalendar({
  classroomId,
}: {
  classroomId: string;
}) {
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.classroom.timetables.queryOptions(classroomId),
  );

  return <TimetablesCalendarClient initialEvents={events} initialView="week" />;
}
