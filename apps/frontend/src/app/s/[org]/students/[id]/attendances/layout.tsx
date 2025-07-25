import type { LucideIcon } from "lucide-react";
import {
  BaselineIcon,
  ClockIcon,
  FileStack,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { EmptyState } from "~/components/EmptyState";
import { StudentAttendanceHeader } from "~/components/students/attendances/StudentAttendanceHeader";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { children } = props;
  const params = await props.params;
  const { t } = await getServerTranslations();
  const classroom = await caller.student.classroom({ studentId: params.id });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }

  const [absence, late, chatter, exclusion, consigne] = await Promise.all([
    caller.absence.studentSummary({ studentId: params.id }),
    caller.lateness.studentSummary({ studentId: params.id }),
    caller.chatter.studentSummary({ studentId: params.id }),
    caller.exclusion.studentSummary({ studentId: params.id }),
    caller.consigne.studentSummary({ studentId: params.id }),
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
        classroomId={classroom.id}
        studentId={params.id}
      />
      <div className="grid md:grid-cols-[275px_1fr]">
        <div className="border-r">
          <div className="bg-muted text-muted-foreground flex cursor-pointer items-center gap-2 border-b px-2 py-2">
            <FileStack className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {" "}
                {t("all_my_attendances")}
              </span>
              <span className="text-muted-foreground text-xs">
                {t("justified")}
              </span>
            </div>
            <span className="ml-auto text-xs font-bold">{total}</span>
          </div>

          <AttendanceGroup
            title={t("all_absences")}
            value={absence.total.toString()}
            icon={BaselineIcon}
            description={`${t("justified")}: ${absence.justified}`}
          />
          <AttendanceGroup
            title={t("all_lates")}
            value={late.value.toString()}
            icon={ClockIcon}
            description={`${t("justified")}: ${late.justified}`}
          />
          <AttendanceGroup
            title={t("all_exclusions")}
            value={exclusion.value.toString()}
            icon={ShieldAlertIcon}
            description={`N/A`}
          />
          <AttendanceGroup
            title={t("all_chatters")}
            value={chatter.value.toString()}
            icon={NewspaperIcon}
            description={`N/A`}
          />
          <AttendanceGroup
            title={t("all_consignes")}
            value={consigne.value.toString()}
            icon={ShapesIcon}
            description={`N/A`}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

function AttendanceGroup({
  icon,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description?: string;
}) {
  const Icon = icon;
  return (
    <div className="hover:bg-muted hover:text-muted-foreground flex cursor-pointer items-center gap-2 border-b px-2 py-2">
      <Icon className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </div>
      <span className="ml-auto text-xs font-bold">{value}</span>
    </div>
  );
}
