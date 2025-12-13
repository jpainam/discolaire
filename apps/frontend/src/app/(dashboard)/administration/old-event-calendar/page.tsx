import { EventCalendarHeader } from "~/components/administration/event-calendar/EventCalendarHeader";
import { Separator } from "~/components/ui/separator";

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <EventCalendarHeader />
      <Separator />
    </div>
  );
}
