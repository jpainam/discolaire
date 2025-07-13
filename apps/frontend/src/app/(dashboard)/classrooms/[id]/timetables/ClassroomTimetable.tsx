"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { useParams } from "next/navigation";
//import { decode } from "entities";
import { CalendarProvider } from "~/components/calendar/calendar-context";
import { ClientContainer } from "~/components/calendar/client-container";
import type { IEvent } from "~/components/calendar/interfaces";
import { useTRPC } from "~/trpc/react";
//import type { IEvent } from "~/components/calendar/interfaces";

export function ClassroomTimetable() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: teachers } = useSuspenseQuery(
    trpc.classroom.teachers.queryOptions(params.id),
  );

  const { data: events } = useSuspenseQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    }),
  );
  const tmpColors = ["blue", "green", "red", "yellow", "purple", "orange"];

  return (
    <CalendarProvider
      //events={events}
      users={teachers.map((teacher) => {
        return {
          id: teacher.id,
          name: decode(teacher.lastName ?? teacher.firstName ?? ""),
          picturePath: teacher.user?.avatar ?? null,
        };
      })}
      events={events.map((e, index) => {
        return {
          id: e.id,
          startDate: e.start.toISOString(),
          endDate: e.end.toISOString(),
          title: e.subject.course.shortName,
          color: tmpColors[index % tmpColors.length], //e.subject.course.color,
          description: "",
          user: {
            id: e.subject.teacher?.id,
            name: decode(
              e.subject.teacher?.lastName ?? e.subject.teacher?.firstName ?? "",
            ),
            picturePath: "",
          },
        } as IEvent;
      })}
    >
      <div className="flex flex-col gap-4 py-2 px-4">
        <ClientContainer />
      </div>
    </CalendarProvider>
  );
}
