import type { LucideIcon } from "lucide-react";
import {
  BaselineIcon,
  ClockIcon,
  FileStack,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";

import { StudentAttendanceHeader } from "~/components/students/attendances/StudentAttendanceHeader";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { children } = props;
  const params = await props.params;

  const classroom = await api.student.classroom({ studentId: params.id });

  const { t } = await getServerTranslations();
  const [absence, late, chatter, exclusion, consigne] = await Promise.all([
    api.absence.studentSummary({ studentId: params.id }),
    api.lateness.studentSummary({ studentId: params.id }),
    api.chatter.studentSummary({ studentId: params.id }),
    api.exclusion.studentSummary({ studentId: params.id }),
    api.consigne.studentSummary({ studentId: params.id }),
  ]);

  const total =
    absence.total +
    chatter.total +
    exclusion.total +
    consigne.total +
    late.total;

  return (
    <div className="flex flex-col">
      <StudentAttendanceHeader
        classroomId={classroom?.id}
        studentId={params.id}
      />
      <div className="grid gap-4 md:grid-cols-[300px_1fr_200px]">
        <div className="h-screen divide-x border-r">
          <div className="flex cursor-pointer items-center gap-2 border-b px-2 py-2 hover:bg-muted hover:text-muted-foreground">
            <FileStack className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {" "}
                {t("all_my_attendances")}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("justified")}
              </span>
            </div>
            <span className="ml-auto text-xs font-bold">{total}</span>
          </div>

          <AttendanceGroup
            title={t("my_absences")}
            value={absence.total.toString()}
            icon={BaselineIcon}
          />
          <AttendanceGroup
            title={t("my_lates")}
            value={late.value}
            icon={ClockIcon}
          />
          <AttendanceGroup
            title={t("my_exclusions")}
            value={exclusion.value.toString()}
            icon={ShieldAlertIcon}
          />
          <AttendanceGroup
            title={t("my_chatters")}
            value={chatter.value.toString()}
            icon={NewspaperIcon}
          />
          <AttendanceGroup
            title={t("my_consignes")}
            value={consigne.value.toString()}
            icon={ShapesIcon}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

async function AttendanceGroup({
  icon,
  title,
  value,
  justified,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  justified?: string;
}) {
  const { t } = await getServerTranslations();
  const Icon = icon;
  return (
    <div className="flex cursor-pointer items-center gap-2 border-b px-2 py-2 hover:bg-muted hover:text-muted-foreground">
      <Icon className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">
          {t("justified")}: {justified ?? 0}
        </span>
      </div>
      <span className="ml-auto text-xs font-bold">{value}</span>
    </div>
  );
}
