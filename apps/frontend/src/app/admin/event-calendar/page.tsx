import { Separator } from "@repo/ui/separator";

import { EventCalendar } from "~/components/administration/event-calendar/EventCalendar";
import { EventCalendarHeader } from "~/components/administration/event-calendar/EventCalendarHeader";

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <EventCalendarHeader />
      <Separator />
      <EventCalendar />
    </div>
  );
}
