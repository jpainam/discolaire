import { CalendarProvider } from "~/components/calendar/calendar-context";

import { getEvents, getUsers } from "~/components/calendar/requests";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, users] = await Promise.all([getEvents(), getUsers()]);

  return (
    <CalendarProvider users={users} events={events}>
      <div className="flex  flex-col gap-4 py-2 px-4">{children}</div>
    </CalendarProvider>
  );
}
