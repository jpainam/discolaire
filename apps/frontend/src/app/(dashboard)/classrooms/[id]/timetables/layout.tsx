import { CalendarProvider } from "~/components/calendar/calendar-context";

import { ChangeBadgeVariantInput } from "~/components/calendar/change-badge-variant-input";

import { getEvents, getUsers } from "~/components/calendar/requests";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, users] = await Promise.all([getEvents(), getUsers()]);

  return (
    <CalendarProvider users={users} events={events}>
      <div className="flex  flex-col gap-4 p-4">
        {children}
        <ChangeBadgeVariantInput />
      </div>
    </CalendarProvider>
  );
}
