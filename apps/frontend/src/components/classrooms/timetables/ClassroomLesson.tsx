/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import { useParams } from "next/navigation";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import type { EventProps, View as RbcView } from "react-big-calendar";

import type { RouterOutputs } from "@repo/api";
import { Skeleton } from "@repo/ui/components/skeleton";
import type {
  Culture,
  DateLocalizer,
  Formats,
} from "~/components/big-calendar";
import BigCalendar, {
  dateFnsLocalizer,
  RbcViews,
} from "~/components/big-calendar";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { SkeletonLineGroup } from "~/components/skeletons/data-table";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import { getNameParts } from "~/utils";
import { CreateEditLesson } from "./CreateEditLesson";
import { LessonDetails } from "./LessonDetails";

//import { CreateEditTimetable } from "./CreateEditTimetable";
import { useQuery } from "@tanstack/react-query";

// moment.locale(i18next.language);
// const localizer = momentLocalizer(moment);
type TimetableEventType =
  RouterOutputs["subjectTimetable"]["byClassroom"][number];

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const CalendarWrapper = BigCalendar;

export function ClassroomLesson() {
  const params = useParams<{ id: string }>();
  const [_currentDate, _] = useQueryState(
    "date",
    parseAsIsoDateTime.withDefault(new Date())
  );
  const trpc = useTRPC();
  const calendarEventsQuery = useQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    })
  );
  const [view, setView] = useState<RbcView>(RbcViews.MONTH);
  const [date, setDate] = useState(new Date());
  const { openModal } = useModal();
  const { t, i18n } = useLocale();

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

  const messages = {
    agenda: t("agenda"),
    allDay: t("all_day"),
    month: t("month"),
    day: t("day"),
    today: t("Today"),
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
        title: t("add"),
        view: <CreateEditLesson />,
      });
    },
    [openModal, t]
  );

  const handleSelectEvent = useCallback(
    (event: TimetableEventType) => {
      openModal({
        title: t("timetable"),
        view: <LessonDetails event={event} />,
      });
    },
    [openModal, t]
  );

  const { _views, _scrollToTime, formats } = useMemo(
    () => ({
      _views: {
        month: true,
        week: true,
        day: true,
        agenda: true,
      },
      _scrollToTime: new Date(2023, 10, 27, 6),
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

  const eventPropGetter = (event: TimetableEventType) => {
    //const bgColor = calendarTypeColors[event.calendarType] || "lightgrey";
    const bgColor = event.subject.course.color;

    const newStyle = {
      backgroundColor: bgColor,
      color: "black",
      borderRadius: "5px",
    };

    return {
      style: newStyle,
    };
  };

  const CustomEvent: React.FC<EventProps<TimetableEventType>> = ({ event }) => {
    const teacher = event.subject.teacher;
    return (
      <div
        className="hidden flex-row gap-2 text-xs text-white md:flex"
        style={{
          backgroundColor: event.subject.course.color,
        }}
      >
        <span className="text-[9px]">{event.subject.course.shortName}</span>
        {teacher && (
          <span className="text-[9px]">{getNameParts(teacher, 1)}</span>
        )}
      </div>
    );
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

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="p-2">
      <CalendarWrapper
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        events={calendarEventsQuery.data ?? []}
        //views={views}
        culture={i18n.language}
        messages={messages}
        eventPropGetter={eventPropGetter}
        //dayPropGetter={dayPropGetter}
        //defaultView="agenda"
        formats={formats}
        startAccessor="start"
        endAccessor="end"
        //dayLayoutAlgorithm="no-overlap"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        //scrollToTime={scrollToTime}
        // formats={{
        //   weekdayFormat: (date, culture, localizer) =>
        //     localizer?.format(date, "dddd", culture).substring(0, 3), // Translate the weekday names
        // }}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
}
