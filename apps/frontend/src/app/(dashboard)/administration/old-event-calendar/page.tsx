import { Separator } from "@repo/ui/components/separator";

import { EventCalendarHeader } from "~/components/administration/event-calendar/EventCalendarHeader";

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <EventCalendarHeader />
      <Separator />
    </div>
  );
}
