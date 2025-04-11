"use client";

import {
  addMonths,
  format,
  getDay,
  getMonth,
  getYear,
  isToday,
  parse,
  startOfWeek,
} from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { Skeleton } from "@repo/ui/components/skeleton";
import type {
  Culture,
  DateLocalizer,
  EventProps,
  Formats,
  RbcView,
} from "~/components/big-calendar";
import BigCalendar, { dateFnsLocalizer } from "~/components/big-calendar";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import EventForm from "./EventForm";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const CalendarWrapper = BigCalendar;

// const calendarTypeColors = {
//   "School Year": "#4fc793",
//   Teaching: "#F1595C",
//   Holidays: "#4669FA",
// };

// export interface CalendarEvent {
//   id: string;
//   calendarType: "School Year" | "Teaching" | "Holidays";
//   title?: string;
//   description?: string;
//   classroom?: string;
//   subject?: string;
//   repeat?: "None" | "Daily" | "Weekly" | "Monthly" | "Yearly";
//   alert?: "None" | "15min" | "30min" | "1hour";
//   start: Date;
//   end: Date;
// }

type CalendarEventProcedureOutput = NonNullable<
  RouterOutputs["calendarEvent"]["all"]
>[number];

// moment.locale(i18next.language);
// const localizer = momentLocalizer(moment);

export function EventCalendar() {
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const calendarEventsQuery = useQuery(
    trpc.calendarEvent.all.queryOptions({
      start: searchParams.get("start")
        ? new Date(searchParams.get("start") ?? "")
        : undefined,
      end: searchParams.get("end")
        ? new Date(searchParams.get("end") ?? "")
        : undefined,
    })
  );

  const locales = {
    fr: fr,
    en: enUS,
    es: es,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  //const theme = useResolvedTheme();
  const [view, setView] = useState<RbcView>("month");
  const { openModal } = useModal();
  const { t, i18n } = useLocale();

  const messages = {
    agenda: t("agenda"),
    allDay: t("all_day"),
    month: t("month"),
    day: t("day"),
    today: t("today"),
    previous: t("previous"),
    next: t("next"),
    date: t("date"),
    noEventsInRange: t("no_events_in_range"),
    time: t("time"),
    tomorrow: t("tomorrow"),
    week: t("week"),
    work_week: t("work_week"),
    yesterday: t("yesterday"),
  };

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      openModal({
        title: t("Create a new event"),
        className: "w-full sm:w-[650px] sm:px-8 p-4",
        view: <EventForm startDate={start} endDate={end} />,
      });
    },

    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEventProcedureOutput) => {
      openModal({
        title: t("Update event"),
        className: "w-full sm:w-[650px] sm:px-8 p-4  ",
        view: <EventForm event={event} />,
      });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { _views, scrollToTime, formats } = useMemo(
    () => ({
      _views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
      scrollToTime: new Date(2023, 10, 27, 6),
      formats: {
        dateFormat: "d",
        weekdayFormat: (
          date: Date,
          culture?: Culture,
          localizer?: DateLocalizer
        ) => localizer?.format(date, "EEE", culture),
        dayFormat: (date: Date, culture?: Culture, localizer?: DateLocalizer) =>
          localizer?.format(date, "EEE M/d", culture),
        timeGutterFormat: (
          date: Date,
          culture?: Culture,
          localizer?: DateLocalizer
        ) => localizer?.format(date, "HH:mm", culture),
      } as Formats,
    }),
    []
  );

  const handleViewChange = (view: RbcView) => {
    setView(view);
  };

  const eventPropGetter = (event: CalendarEventProcedureOutput) => {
    //const bgColor = calendarTypeColors[event.calendarType] || "lightgrey";
    const bgColor = event.calendarType?.backgroundColor ?? "lightgrey";

    const newStyle = {
      backgroundColor: bgColor,
      color: "black",
      borderRadius: "5px",
    };

    return {
      style: newStyle,
    };
  };

  const CustomEvent: React.FC<EventProps<CalendarEventProcedureOutput>> = ({
    event,
  }) => {
    return (
      <div className="hidden text-sm text-white md:block">{event.title}</div>
    );
  };

  const dayPropGetter = (date: Date) => {
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
    const today = new Date();
    const nextMonth = addMonths(today, 1);
    const isNextMonth =
      getMonth(date) === getMonth(nextMonth) &&
      getYear(date) === getYear(nextMonth);

    const style = {};
    let className = "";

    if (isWeekend) {
      className = "text-secondary-foreground bg-secondary";
    } else if (isNextMonth) {
      className = "text-muted-foreground/40 bg-muted/40";
    } else if (isToday(date)) {
      className = "text-accent-foreground bg-accent";
    } else {
      className = "";
    }

    return { style, className };
  };

  if (calendarEventsQuery.isPending) {
    return (
      <div className="flex w-full flex-col gap-2 px-2">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 md:w-1/4" />
          <Skeleton className="h-8 md:w-32" />
          <Skeleton className="h-8 md:w-1/4" />
        </div>
        {rangeMap(5, (index) => (
          <SkeletonLineGroup
            className="grid-cols-7 gap-2"
            columns={7}
            key={index}
            skeletonClassName="h-[150px] w-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-15rem)] px-2">
      <CalendarWrapper
        localizer={localizer}
        events={calendarEventsQuery.data ?? []}
        //views={views}
        view={view}
        messages={messages}
        onView={handleViewChange}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        defaultView="month"
        formats={formats}
        startAccessor="start"
        culture={i18n.language}
        endAccessor="end"
        dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        scrollToTime={scrollToTime}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
}
