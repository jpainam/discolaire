"use client";

//import { decode } from "entities";
import { CalendarProvider } from "~/components/calendar/calendar-context";
import { ClientContainer } from "~/components/calendar/client-container";
import type { IEvent, IUser } from "~/components/calendar/interfaces";
//import type { IEvent } from "~/components/calendar/interfaces";

export function ClassroomTimetable({
  events,
  users,
}: {
  events: IEvent[];
  users: IUser[];
}) {
  //const params = useParams<{ id: string }>();
  //const trpc = useTRPC();
  // const { data: teachers } = useSuspenseQuery(
  //   trpc.classroom.teachers.queryOptions(params.id)
  // );

  // const { data: events } = useSuspenseQuery(
  //   trpc.lesson.byClassroom.queryOptions({
  //     classroomId: params.id,
  //   })
  // );
  //   result.push({
  //         id: currentId++,
  //         startDate: startDate.toISOString(),
  //         endDate: endDate.toISOString(),
  //         // @ts-expect-error TODO: Fix this
  //         title: events[Math.floor(Math.random() * events.length)],
  //         // @ts-expect-error TODO: Fix this
  //         color: colors[Math.floor(Math.random() * colors.length)],
  //         description:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //         // @ts-expect-error TODO: Fix this
  //         user: USERS_MOCK[Math.floor(Math.random() * USERS_MOCK.length)],
  //       });

  return (
    <CalendarProvider
      users={users}
      events={events}
      // users={teachers.map((teacher) => {
      //   return {
      //     id: teacher.id,
      //     name: decode(teacher.lastName ?? teacher.firstName ?? ""),
      //     picturePath: teacher.user?.avatar ?? null,
      //   };
      // })}
      // events={events.map((e) => {
      //   return {
      //     id: e.id,
      //     startDate: e.start.toISOString(),
      //     endDate: e.end.toISOString(),
      //     title: e.subject.course.shortName,
      //     color: e.subject.course.color,
      //     description: "",
      //     user: {
      //       id: e.subject.teacher?.id,
      //       name: decode(
      //         e.subject.teacher?.lastName ?? e.subject.teacher?.firstName ?? ""
      //       ),
      //       picturePath: "",
      //     },
      //   } as IEvent;
      // })}
    >
      <div className="flex  flex-col gap-4 py-2 px-4">
        <ClientContainer />
      </div>
    </CalendarProvider>
  );
}
