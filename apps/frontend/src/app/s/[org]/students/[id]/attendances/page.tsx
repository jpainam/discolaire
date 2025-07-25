import { Suspense } from "react";
import {
  BaselineIcon,
  CalendarDays,
  DiameterIcon,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";

import { EmptyState } from "~/components/EmptyState";
import { StudentAttendanceAction } from "~/components/students/attendances/StudentAttendanceAction";
import { getServerTranslations } from "~/i18n/server";
import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ termId?: string }>;
}) {
  const { t } = await getServerTranslations();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const studentId = params.id;
  const termId = searchParams.termId ?? undefined;

  const classroom = await caller.student.classroom({ studentId: studentId });
  if (!classroom) {
    return (
      <EmptyState
        className="my-8 self-start"
        title={t("student_not_registered_yet")}
      />
    );
  }

  return (
    <div className="grid auto-rows-min gap-4 p-4 md:grid-cols-2">
      <Suspense>
        <AbsenceItem termId={termId} studentId={studentId} />
      </Suspense>
      <Suspense>
        <ExclusionItem termId={termId} studentId={studentId} />
      </Suspense>
      <Suspense>
        <ConsigneItem termId={termId} studentId={studentId} />
      </Suspense>
      <Suspense>
        <ChatterItem termId={termId} studentId={studentId} />
      </Suspense>
      <Suspense>
        <LateItem termId={termId} studentId={studentId} />
      </Suspense>
    </div>
  );
}
async function LateItem({
  studentId,
  termId,
}: {
  studentId: string;
  termId?: string;
}) {
  const lates = await caller.lateness.byStudent({
    studentId: studentId,
    termId: termId,
  });
  // type: "lateness" as const,
  //     date: lateness.date,
  //     title: lateness.duration.toString(),
  //     id: lateness.id,
  //     justificationId: lateness.justification?.id,
  //     attendance: lateness,
  const { t, i18n } = await getServerTranslations();
  return (
    <>
      {lates.map((item, index) => {
        return (
          <div
            key={`${item.id}-exclusion-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <DiameterIcon className={"text-destructive h-6 w-6"} />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between gap-1">
                <div className="text-muted-foreground text-sm font-bold">
                  {t("lateness")}
                </div>

                <div className="text-muted-foreground text-xs">
                  {t("duration")}: {item.duration.toString()}
                </div>
                {item.justified && (
                  <div className="flex flex-row items-center gap-2">
                    <Badge variant={"default"}>{item.reason}</Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row text-xs font-semibold">
              <CalendarDays className="mr-1 h-4 w-4" />
              {Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(item.date)}
            </div>
            <StudentAttendanceAction
              attendance={item}
              type={"lateness"}
              id={item.id}
            />
          </div>
        );
      })}
    </>
  );
}
async function ChatterItem({
  studentId,
  termId,
}: {
  studentId: string;
  termId?: string;
}) {
  const chatters = await caller.chatter.byStudent({
    studentId: studentId,
    termId: termId,
  });
  const { t, i18n } = await getServerTranslations();
  return (
    <>
      {chatters.map((item, index) => {
        return (
          <div
            key={`${item.id}-exclusion-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <NewspaperIcon className={"text-destructive h-6 w-6"} />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between gap-1">
                <div className="text-muted-foreground text-sm font-bold">
                  {t("chatter")}
                </div>

                <div className="text-muted-foreground text-xs">
                  {t("number")}: {item.value.toString()}
                </div>
              </div>
            </div>
            <div className="flex flex-row text-xs font-semibold">
              <CalendarDays className="mr-1 h-4 w-4" />
              {Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(item.date)}
            </div>
            <StudentAttendanceAction
              // @ts-expect-error TODO: fix this
              attendance={item}
              type={"chatter"}
              id={item.id}
            />
          </div>
        );
      })}
    </>
  );
}
async function ConsigneItem({
  studentId,
  termId,
}: {
  studentId: string;
  termId?: string;
}) {
  const consignes = await caller.consigne.byStudent({
    studentId: studentId,
    termId: termId,
  });
  const { t, i18n } = await getServerTranslations();

  return (
    <>
      {consignes.map((item, index) => {
        return (
          <div
            key={`${item.id}-absence-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <ShapesIcon className={"text-destructive h-6 w-6"} />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between gap-1">
                <div className="text-muted-foreground text-sm font-bold">
                  {t("consigne")}
                </div>

                <div className="text-muted-foreground text-xs">{item.task}</div>

                <div className="flex flex-row items-center gap-2">
                  <Badge variant={"default"}>
                    {t("duration")}: {item.duration.toString()} {t("hours")}
                  </Badge>
                  {/* <Badge variant={"outline"}>
                      {item.value.toString()} {t("non_justified")}
                    </Badge> */}
                </div>
              </div>
            </div>
            <div className="flex flex-row text-xs font-semibold">
              <CalendarDays className="mr-1 h-4 w-4" />
              {Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(item.date)}
            </div>
            <StudentAttendanceAction
              // @ts-expect-error TODO: fix this
              attendance={item}
              type={"consigne"}
              id={item.id}
            />
          </div>
        );
      })}
    </>
  );
}

async function ExclusionItem({
  studentId,
  termId,
}: {
  studentId: string;
  termId?: string;
}) {
  const exclusions = await caller.exclusion.byStudent({
    studentId: studentId,
    termId: termId,
  });
  const { t, i18n } = await getServerTranslations();

  return (
    <>
      {exclusions.map((item, index) => {
        return (
          <div
            key={`${item.id}-exclusion-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <ShieldAlertIcon className={"text-destructive h-6 w-6"} />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between gap-1">
                <div className="text-muted-foreground text-sm font-bold">
                  {t("exclusion")}
                </div>

                <div className="text-muted-foreground text-xs">
                  {item.reason}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Badge className="text-xs" variant={"default"}>
                    {t("from")}{" "}
                    {Intl.DateTimeFormat(i18n.language, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    }).format(item.startDate)}{" "}
                    {t("to")}{" "}
                    {Intl.DateTimeFormat(i18n.language, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    }).format(item.endDate)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-row text-xs font-semibold">
              <CalendarDays className="mr-1 h-4 w-4" />
              {Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(item.startDate)}
            </div>
            <StudentAttendanceAction
              attendance={item}
              type={"exclusion"}
              id={item.id}
            />
          </div>
        );
      })}
    </>
  );
}

async function AbsenceItem({
  studentId,
  termId,
}: {
  studentId: string;
  termId?: string;
}) {
  const absences = await caller.absence.byStudent({
    studentId: studentId,
    termId: termId,
  });
  const { t, i18n } = await getServerTranslations();

  return (
    <>
      {absences.map((item, index) => {
        return (
          <div
            key={`${item.id}-absence-${index}`}
            className="flex flex-row items-center gap-2 rounded-md border p-2"
          >
            <BaselineIcon
              className={cn(
                "h-6 w-6",
                !item.justified ? "text-destructive" : "text-green-700",
              )}
            />
            <div className="flex-1 items-start justify-start">
              <div className="flex flex-col justify-between">
                <div className="text-muted-foreground text-sm font-bold">
                  {t("absence")}
                </div>

                <div className="text-muted-foreground text-xs">
                  {t("total_absences") + ": " + item.value.toString()}
                </div>
                {item.justified && (
                  <div className="flex flex-row items-center gap-2">
                    <Badge variant={"default"}>
                      {item.reason} {t("justified")}
                    </Badge>
                    <Badge variant={"outline"}>
                      {item.value.toString()} {t("non_justified")}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row text-xs font-semibold">
              <CalendarDays className="mr-1 h-4 w-4" />
              {Intl.DateTimeFormat(i18n.language, {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(item.date)}
            </div>
            <StudentAttendanceAction
              attendance={item}
              type={"absence"}
              id={item.id}
            />
          </div>
        );
      })}
    </>
  );
}
