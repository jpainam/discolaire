"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useTRPC } from "~/trpc/react";

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
