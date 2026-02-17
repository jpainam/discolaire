"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useTRPC } from "~/trpc/react";
import { StaffTimetableEventDetails } from "./StaffTimetableEventDetails";

export function StaffTimetablesCalendar({ staffId }: { staffId: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.staff.timetables.queryOptions(staffId),
  );
  const { data: staff } = useSuspenseQuery(
    trpc.staff.get.queryOptions(staffId),
  );

  const staffName = [staff.prefix, staff.lastName, staff.firstName]
    .filter(Boolean)
    .join(" ");

  return (
    <TimetablesCalendarClient
      initialEvents={events}
      initialView="week"
      addCreatedEventToCalendar={false}
      getEventModalOptions={(event) => ({
        title: event.title,
        description: `${staffName} - ${t("timetable")}`,
        className: "sm:max-w-md",
        view: <StaffTimetableEventDetails event={event} />,
      })}
    />
  );
}
