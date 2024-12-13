import { format } from "date-fns";
import { AlertCircle, Clock, MessageSquare } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Badge } from "@repo/ui/badge";
import { EmptyState } from "@repo/ui/EmptyState";

import { AvatarState } from "~/components/AvatarState";
import { AttendanceAction } from "~/components/classrooms/attendances/AttendanceAction";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; term?: string; date?: Date }>;
}) {
  const searchParams = await props.searchParams;

  const { type, date, term } = searchParams;
  console.log(type, date, term);

  const params = await props.params;
  const { t } = await getServerTranslations();

  const { id } = params;
  const [absences, lates] = await Promise.all([
    api.absence.byClassroom({
      classroomId: id,
      termId: isNaN(Number(term)) ? undefined : Number(term),
    }),
    api.lateness.byClassroom({
      classroomId: id,
      termId: isNaN(Number(term)) ? undefined : Number(term),
    }),
  ]);
  const attendances: {
    id: number;
    name: string;
    studentId: string;
    type: "absence" | "lateness" | "chatter" | "consigne" | "exclusion";
    justification: string;
    description: string;
    date: Date;
  }[] = [
    ...absences.map((absence) => ({
      id: absence.id,
      name: absence.student.lastName + " " + absence.student.firstName,
      studentId: absence.studentId,
      type: "absence" as const,
      justification: absence.justification?.reason ?? "",
      description: absence.value.toString(),
      date: absence.date,
    })),
    ...lates.map((late) => ({
      id: late.id,
      name: late.student.lastName + " " + late.student.firstName,
      studentId: late.studentId,
      type: "lateness" as const,
      justification: late.justification?.reason ?? "",
      description: late.duration.toString(),
      date: late.date,
    })),
  ];
  if (!attendances.length) {
    return <EmptyState className="my-8" title={t("no_attendances_recorded")} />;
  }

  return (
    <div className="grid w-full gap-2 p-2 md:grid-cols-2 lg:grid-cols-3">
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
                variant={
                  attendance.type === "absence"
                    ? "destructive"
                    : attendance.type === "lateness"
                      ? "secondary"
                      : "default"
                }
              >
                {attendance.type === "absence" && (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "lateness" && (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {attendance.type === "chatter" && (
                  <MessageSquare className="mr-1 h-3 w-3" />
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
              attendanceId={attendance.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
