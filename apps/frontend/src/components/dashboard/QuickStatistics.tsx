import { School, Users } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";

import { api } from "~/trpc/server";
import { CountCard } from "./CountCard";

export async function QuickStatistics() {
  const studentCount = await api.student.count();
  const staffCount = await api.staff.count();
  const classroomCount = await api.classroom.all();
  const contactCount = await api.contact.count();
  const classroomTotal = classroomCount.length;
  const { t } = await getServerTranslations();
  return (
    <div className="col-span-full mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <CountCard
        title={t("total_students")}
        count={studentCount.total}
        icon={Users}
        description="+10% from last month"
      />

      <CountCard
        title={t("total_staffs")}
        count={staffCount.total}
        icon={Users}
        description="+10% from last month"
      />
      <CountCard
        title={t("total_classrooms")}
        count={classroomTotal}
        icon={School}
        description="+10% from last month"
      />
      <CountCard
        title={t("total_contacts")}
        count={contactCount.total}
        icon={Users}
        description="+10% from last month"
      />
    </div>
  );
}
