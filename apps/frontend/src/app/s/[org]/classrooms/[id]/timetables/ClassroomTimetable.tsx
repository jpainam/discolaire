"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addDays, startOfWeek } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

type ViewType = "month" | "week" | "day";

export function ClassroomTimetable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const { data: data } = useSuspenseQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
    }),
  );
  const [today] = useState(() => new Date());
  const events = useMemo(() => buildWeekEvents(data, today), [data, today]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [teacherId, setTeacherId] = useQueryState("teacherId");

  const { data: teachers } = useSuspenseQuery(
    trpc.classroom.teachers.queryOptions(params.id),
  );

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  const locale = useLocale();
  const getDateRangeText = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      });
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString(locale, { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return currentDate.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-border bg-muted/50 border-b px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-4 w-4" />
            <Label>{t("timetable")}</Label>
          </div>

          <Select
            onValueChange={(val) => {
              void setTeacherId(val);
            }}
          >
            <SelectTrigger className="w-96">
              <SelectValue placeholder={t("teachers")} />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t, index) => {
                return (
                  <SelectItem key={index} value={t.id}>
                    {getFullName(t)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigateToday}>
              {t("Today")}
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-w-[280px] text-center font-bold">
              {getDateRangeText()}
            </div>
          </div>

          <div className="bg-muted flex gap-1 rounded-lg p-1">
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className={cn(view === "month" && "bg-background shadow-sm")}
            >
              {t("Month")}
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className={cn(view === "week" && "bg-background shadow-sm")}
            >
              {t("Week")}
            </Button>
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className={cn(view === "day" && "bg-background shadow-sm")}
            >
              {t("Day")}
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 overflow-auto">
        {view === "month" && (
          <MonthView currentDate={currentDate} events={events} />
        )}
        {view === "week" && (
          <WeekView currentDate={currentDate} events={events} />
        )}
        {view === "day" && (
          <DayView currentDate={currentDate} events={events} />
        )}
      </div>
    </div>
  );
}

function parseTimeStr(t: string) {
  // t = "HH:MM"
  const [hStr, mStr] = t.split(":");
  const hour = Number(hStr);
  const minute = Number(mStr);
  return { hour, minute };
}

function buildWeekEvents(
  recurringRows: RouterOutputs["subjectTimetable"]["byClassroom"],
  weekAnchor: Date,
): {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}[] {
  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 0 });

  return recurringRows.map((row) => {
    const { hour: startHour, minute: startMinute } = parseTimeStr(row.start);
    const { hour: endHour, minute: endMinute } = parseTimeStr(row.end);
    // Find the actual date for this weekday in that same week
    // weekday=0 means Sunday => addDays(weekStart, 0)
    // weekday=1 means Monday => addDays(weekStart, 1)
    const dayDate = addDays(weekStart, row.weekday);

    // Build final Date objects
    const eventStart = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      startHour,
      startMinute,
      0,
      0,
    );

    const eventEnd = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      endHour,
      endMinute,
      0,
      0,
    );

    return {
      id: String(row.id),
      title: row.subject.course.shortName,
      start: eventStart,
      end: eventEnd,
      color: row.subject.course.color,
    };
  });
}
