"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { CreateClassroomTimetable } from "./CreateClassroomTimetable";

export function ClassroomTimetablesCalendar({
  classroomId,
}: {
  classroomId: string;
}) {
  const t = useTranslations();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.classroom.timetables.queryOptions(classroomId),
  );
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );

  return (
    <TimetablesCalendarClient
      initialEvents={events}
      initialView="week"
      addCreatedEventToCalendar={false}
      onCreateSlot={(slot) => {
        openModal({
          title: t("create"),
          description: `${classroom.name} - ${t("timetable")}`,
          className: "sm:max-w-xl",
          view: (
            <CreateClassroomTimetable
              classroomId={classroomId}
              initialStart={slot.start}
              initialEnd={slot.end}
            />
          ),
        });
      }}
    />
  );
}
