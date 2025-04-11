import { subMonths } from "date-fns";
import { School, Users } from "lucide-react";

import { getServerTranslations } from "~/i18n/server";

import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";
import { CountCard } from "./CountCard";

export async function QuickStatistics({ className }: { className?: string }) {
  const studentCount = await caller.student.count();
  const staffCount = await caller.staff.count();
  const classroomCount = await caller.classroom.all();
  const contactCount = await caller.contact.count();
  const classroomTotal = classroomCount.length;
  const newClassrooms = classroomCount.filter(
    (classroom) => classroom.createdAt >= subMonths(new Date(), 1),
  ).length;
  const { t } = await getServerTranslations();
  return (
    <div
      className={cn(
        "grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar",
        className,
      )}
    >
      <CountCard
        title={t("total_students")}
        count={studentCount.total}
        icon={Users}
        percentage={(studentCount.new / studentCount.total) * 100}
      />

      <CountCard
        title={t("total_staffs")}
        count={staffCount.total}
        icon={Users}
        percentage={(staffCount.new / staffCount.total) * 100}
      />
      <CountCard
        title={t("total_classrooms")}
        count={classroomTotal}
        icon={School}
        percentage={(newClassrooms / classroomTotal) * 100}
      />
      <CountCard
        title={t("total_contacts")}
        count={contactCount.total}
        icon={Users}
        percentage={(contactCount.new / contactCount.total) * 100}
      />
    </div>
  );
}
