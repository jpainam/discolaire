"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TimetablesCalendarClient } from "~/components/timetables/TimetablesCalendarClient";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { ClassroomTimetableEventDetails } from "./ClassroomTimetableEventDetails";
import { CreateClassroomTimetable } from "./CreateClassroomTimetable";

export function ClassroomTimetablesCalendar({
  classroomId,
  initialSubjectId,
}: {
  classroomId: string;
  initialSubjectId?: number;
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
      getEventModalOptions={(event) => ({
        title: event.title,
        description: `${classroom.name} - ${t("timetable")}`,
        className: "sm:max-w-md",
        view: <ClassroomTimetableEventDetails event={event} />,
      })}
      onCreateSlot={(slot) => {
        openModal({
          title: t("create"),
          description: `${classroom.name} - ${t("timetable")}`,
          className: "sm:max-w-xl",
          view: (
            <CreateClassroomTimetable
              classroomId={classroomId}
              initialSubjectId={initialSubjectId}
              initialStart={slot.start}
              initialEnd={slot.end}
            />
          ),
        });
      }}
    />
  );
}
