import { subMonths } from "date-fns";
import { School, Users } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";

import { api } from "~/trpc/server";
import { CountCard } from "./CountCard";
import { MaleVsFemaleCount } from "./MaleVsFemaleCount";

export async function QuickStatistics() {
  const studentCount = await api.student.count();
  const staffCount = await api.staff.count();
  const classroomCount = await api.classroom.all();
  const contactCount = await api.contact.count();
  const classroomTotal = classroomCount.length;
  const newClassrooms = classroomCount.filter(
    (classroom) => classroom.createdAt >= subMonths(new Date(), 1),
  ).length;
  const { t } = await getServerTranslations();
  return (
    <div className="col-span-full mb-8 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      <MaleVsFemaleCount
        title={t("totalNumberOfStudents")}
        maleCount={studentCount.male || 0}
        femaleCount={studentCount.female || 0}
        totalCount={studentCount.total || 0}
      />
      <div className="col-span-3 grid gap-4 lg:grid-cols-3">
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
    </div>
  );
}
