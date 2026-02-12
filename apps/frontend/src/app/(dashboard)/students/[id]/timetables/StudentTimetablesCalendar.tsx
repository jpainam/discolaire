"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";

export function StudentTimetablesCalendar({
  studentId,
}: {
  studentId: string;
}) {
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.student.timetables.queryOptions(studentId),
  );

  return <TimetablesCalendarClient initialEvents={events} initialView="week" />;
}
