import type { PropsWithChildren } from "react";

import { CalendarProvider } from "~/components/event-calendar/calendar-context";

export default function Layout(props: PropsWithChildren) {
  return <CalendarProvider>{props.children}</CalendarProvider>;
}
