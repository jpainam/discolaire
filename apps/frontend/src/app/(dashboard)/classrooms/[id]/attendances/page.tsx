import { format } from "date-fns";
import {
  AlertCircle,
  Clock,
  MessageSquare,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import type { RouterOutputs } from "@repo/api";
import { cn } from "@repo/ui/lib/utils";
import i18next from "i18next";
import { AvatarState } from "~/components/AvatarState";
import { AttendanceAction } from "~/components/classrooms/attendances/AttendanceAction";
import { api } from "~/trpc/server";

type LatenessType = RouterOutputs["lateness"]["byClassroom"][number];
type AbsenceType = RouterOutputs["absence"]["byClassroom"][number];
export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; term?: string; date?: Date }>;
}) {
  const searchParams = await props.searchParams;

  const { term } = searchParams;

  const params = await props.params;
  const { t } = await getServerTranslations();

  const { id: classroomId } = params;
  const termId = isNaN(Number(term)) ? undefined : Number(term);
  const [absences, lates, consignes, chatters, exclusions] = await Promise.all([
    api.absence.byClassroom({ classroomId, termId }),
    api.lateness.byClassroom({ classroomId, termId }),
    api.consigne.byClassroom({ classroomId, termId }),
    api.chatter.byClassroom({ classroomId, termId }),
    api.exclusion.byClassroom({ classroomId, termId }),
  ]);
  const attendances: {
    id: number;
    name?: string | null;
    studentId: string;
    type: "absence" | "lateness" | "chatter" | "consigne" | "exclusion";
    justification?: string;
    description: string;
    date: Date;
    attendance?: AbsenceType | LatenessType;
  }[] = [
    ...absences.map((absence) => ({
      id: absence.id,
      name: absence.student.lastName,
      studentId: absence.studentId,
      type: "absence" as const,
      justification: absence.justification?.reason ?? "",
      description: absence.value.toString(),
      date: absence.date,
      attendance: absence,
    })),
    ...lates.map((late) => ({
      id: late.id,
      name: late.student.lastName,
      studentId: late.studentId,
      type: "lateness" as const,
      justification: late.justification?.reason ?? "",
      description: late.duration.toString(),
      date: late.date,
      attendance: late,
    })),
    ...consignes.map((consigne) => ({
      id: consigne.id,
      name: consigne.student.lastName,
      studentId: consigne.studentId,
      type: "consigne" as const,
      description: consigne.duration.toString(),
      date: consigne.date,
    })),
    ...chatters.map((chatter) => ({
      id: chatter.id,
      name: chatter.student.lastName,
      studentId: chatter.studentId,
      type: "chatter" as const,
      description: chatter.value.toString(),
      date: chatter.date,
    })),
    ...exclusions.map((excl) => ({
      id: excl.id,
      name: excl.student.lastName,
      studentId: excl.studentId,
      type: "exclusion" as const,
      description:
        t("from") +
        " " +
        excl.startDate.toLocaleDateString(i18next.language, {
          month: "short",
          day: "numeric",
        }) +
        ` ${t("to")} ` +
        excl.endDate.toLocaleDateString(i18next.language, {
          month: "short",
          day: "numeric",
        }),
      date: excl.startDate,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!attendances.length) {
    return <EmptyState className="my-8" title={t("no_attendances_recorded")} />;
  }

  return (
    <div className="grid w-full gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {attendances.map((attendance, index) => (
        <div
          key={`attendance-${index}`}
          className="flex items-start space-x-4 rounded-sm border p-2"
        >
          <AvatarState />

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm leading-none">{attendance.name}</p>
              <Badge
                className={cn(
                  attendance.type === "chatter" && "bg-yellow-800",
                  attendance.type === "consigne" && "bg-pink-800",
                  attendance.type === "lateness" && "bg-green-800 text-white"
                )}
                variant={
                  attendance.type === "absence"
                    ? "destructive"
                    : attendance.type === "lateness"
                      ? "outline"
                      : "default"
                }
              >
                {attendance.type === "absence" && (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "lateness" && (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "consigne" && (
                  <ShapesIcon className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "chatter" && (
                  <MessageSquare className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "exclusion" && (
                  <ShieldAlertIcon className="mr-1 h-3 w-3" />
                )}
                {attendance.type.charAt(0).toUpperCase() +
                  attendance.type.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(attendance.type)} - {attendance.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(attendance.date, "PPP")}
            </p>
          </div>

          <div className="ml-auto">
            <AttendanceAction
              type={attendance.type}
              attendance={attendance.attendance}
              attendanceId={attendance.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
