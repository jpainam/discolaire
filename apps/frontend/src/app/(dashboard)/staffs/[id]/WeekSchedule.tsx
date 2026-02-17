"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  addDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Users } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { EmptyComponent } from "~/components/EmptyComponent";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function TodaySchedule({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: events } = useSuspenseQuery(
    trpc.staff.timetables.queryOptions(staffId),
  );

  const now = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => startOfWeek(now, { weekStartsOn: 1 }), [now]);
  const weekEnd = useMemo(() => endOfWeek(now, { weekStartsOn: 1 }), [now]);

  const schedule = useMemo(() => {
    // Filter events to the current week only
    return events
      .filter((ev) => {
        const start = new Date(ev.start);
        return (
          (isAfter(start, weekStart) || isSameDay(start, weekStart)) &&
          (isBefore(start, weekEnd) || isSameDay(start, weekEnd))
        );
      })
      .map((ev) => {
        const start = new Date(ev.start);
        const end = new Date(ev.end);
        const isToday = isSameDay(start, now);
        const isPast = isBefore(start, now) && !isToday;
        const meta = ev.metadata as {
          classroomName?: string;
          studentCount?: number;
        } | null;

        return {
          id: ev.id,
          date: start,
          dayLabel: WEEKDAY_LABELS[start.getDay()] ?? "",
          startTime: format(start, "HH:mm"),
          endTime: format(end, "HH:mm"),
          courseName: ev.description ?? ev.title,
          classroomName: meta?.classroomName ?? ev.location ?? "",
          studentCount: meta?.studentCount ?? 0,
          isToday,
          isPast,
        };
      });
  }, [events, weekStart, weekEnd, now]);

  const weekLabel = `${format(weekStart, "dd MMM", { locale: fr })} - ${format(addDays(weekStart, 5), "dd MMM", { locale: fr })}`;

  if (schedule.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{"Emploi du temps"}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyComponent
            title="Aucun cours"
            description="Aucun emploi du temps configuré pour ce personnel"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{"Emploi du temps"}</CardTitle>
        <CardAction>
          <Badge variant="outline" className="text-xs font-normal">
            {weekLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 rounded-lg p-3 transition-colors",
              item.isToday
                ? "bg-primary/10 ring-primary/20 ring-1"
                : item.isPast
                  ? "opacity-60"
                  : "hover:bg-muted/50",
            )}
          >
            <div className="w-20 shrink-0">
              <p className="text-muted-foreground text-xs font-medium">
                {item.dayLabel} {format(item.date, "dd/MM")}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.startTime} - {item.endTime}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.courseName}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  {item.classroomName}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  {item.studentCount}
                </span>
              </div>
            </div>
            {item.isToday && (
              <Badge className="bg-accent text-accent-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Auj.
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
