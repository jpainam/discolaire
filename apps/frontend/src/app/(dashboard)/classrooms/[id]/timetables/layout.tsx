import { CalendarProvider } from "~/components/calendar/calendar-context";

import { decode } from "entities";
import { getEvents, getUsers } from "~/components/calendar/requests";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [events, teachers] = await Promise.all([
    getEvents(),
    getUsers({ classroomId: id }),
  ]);

  return (
    <CalendarProvider
      users={teachers.map((teacher) => {
        return {
          id: teacher.id,
          name: decode(teacher.lastName ?? teacher.firstName ?? ""),
          picturePath: teacher.user?.avatar ?? null,
        };
      })}
      events={events}
    >
      <div className="flex  flex-col gap-4 py-2 px-4">{children}</div>
    </CalendarProvider>
  );
}
