"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useTRPC } from "~/trpc/react";

export function ContactTimetablesCalendar({
  contactId,
}: {
  contactId: string;
}) {
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.contact.timetables.queryOptions(contactId),
  );

  return <TimetablesCalendarClient initialEvents={events} initialView="week" />;
}
