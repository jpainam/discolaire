import {
  BaselineIcon,
  CalendarDays,
  DiameterIcon,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Badge } from "@repo/ui/badge";
import { Checkbox } from "@repo/ui/checkbox";
import { EmptyState } from "@repo/ui/EmptyState";
import { Label } from "@repo/ui/label";

import { StudentAttendanceAction } from "~/components/students/attendances/StudentAttendanceAction";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ termId?: string }>;
}) {
  const { t, i18n } = await getServerTranslations();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const studentId = params.id;
  const termId = searchParams.termId
    ? parseInt(searchParams.termId)
    : undefined;
  const [absences, chatters, consignes, lateness, exclusions] =
    await Promise.all([
      api.absence.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.chatter.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.consigne.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.lateness.byStudent({
        studentId: studentId,
        termId: termId,
      }),
      api.exclusion.byStudent({
        studentId: studentId,
        termId: termId,
      }),
    ]);
  const TYPE_TO_ICON = {
    absence: BaselineIcon,
    chatter: NewspaperIcon,
    consigne: ShapesIcon,
    exclusion: ShieldAlertIcon,
    lateness: DiameterIcon,
  };
  // merge all absences, chatter etc.. into items array
  // sort by date
  const items: {
    type: "absence" | "chatter" | "consigne" | "lateness" | "exclusion";
    date: Date;
    id: number;
    title: string;
    total?: string;
    justified?: string;
    justificationId?: number;
    endDate?: Date;
  }[] = [
    absences.map((absence) => ({
      type: "absence" as const,
      title: t("total_absences") + ": " + absence.value.toString(),
      date: absence.date,
      id: absence.id,
      total: absence.value.toString(),
      justified: absence.justification?.value.toString(),
      justificationId: absence.justification?.id,
    })),
    chatters.map((chatter) => ({
      type: "chatter" as const,
      title: chatter.value.toString(),
      date: chatter.date,
      total: chatter.value.toString(),
      id: chatter.id,
    })),
    consignes.map((consigne) => ({
      type: "consigne" as const,
      date: consigne.date,
      title: consigne.task,
      id: consigne.id,
    })),
    lateness.map((lateness) => ({
      type: "lateness" as const,
      date: lateness.date,
      title: lateness.duration.toString(),
      id: lateness.id,
      justificationId: lateness.justification?.id,
    })),
    exclusions.map((exclusion) => ({
      type: "exclusion" as const,
      date: exclusion.startDate,
      endDate: exclusion.endDate,
      title: exclusion.reason,
      id: exclusion.id,
    })),
  ]
    .flat()
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!items.length) {
    return (
      <EmptyState
        className="my-8 self-start"
        title={t("no_attendances_recorded")}
      />
    );
  }

  const classroom = await api.student.classroom({ studentId: studentId });
  if (!classroom) {
    return (
      <EmptyState
        className="my-8 self-start"
        title={t("student_not_registered_yet")}
      />
    );
  }

  return (
    <div className="grid auto-rows-min gap-2 md:grid-cols-2">
      <div className="col-span-2 flex items-center gap-2 pt-2">
        <Checkbox
          id="actions"
          //checked={showActionRequired}
          //onCheckedChange={setShowActionRequired}
        />
        <Label htmlFor="actions" className="text-sm">
          {t("show_events_that_require_action")}
        </Label>
      </div>

      {items.map((item, index) => {
        const Icon = TYPE_TO_ICON[item.type];
        return (
          <div
            key={`${item.type}-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <Icon
              className={cn(
                "h-6 w-6",
                !item.justificationId ? "text-destructive" : "text-green-700",
              )}
            />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between gap-1">
                <div className="flex flex-row text-xs font-semibold">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {Intl.DateTimeFormat(i18n.language, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }).format(item.date)}
                </div>

                <div className="text-sm text-muted-foreground">
                  {item.title}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Badge variant={"default"}>
                    {item.justified ?? 0} {t("justified")}
                  </Badge>
                  <Badge variant={"outline"}>
                    {item.total ?? 0} {t("non_justified")}
                  </Badge>
                </div>
              </div>
            </div>
            <StudentAttendanceAction type={item.type} id={item.id} />
          </div>
        );
      })}
    </div>
  );
}
