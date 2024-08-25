import { getServerTranslations } from "@/app/i18n/server";
import { cn } from "@/lib/utils";

import { api } from "@/trpc/server";
import { IconType } from "react-icons/lib";
import { MaleVsFemaleCount } from "./MaleVsFemaleCount";

type JobStatsType = {
  className?: string;
};

export type StatType = {
  icon: IconType;
  title: string;
  amount: number;
  increased: boolean;
  percentage: string;
  iconWrapperFill?: string;
};

export async function EffectiveStat({ className }: JobStatsType) {
  const { t } = await getServerTranslations();
  const studentsCount = await api.student.count();
  const enrollmentsCount = await api.enrollment.count();

  return (
    <div
      className={cn("grid text-sm grid-cols-1 gap-4 md:grid-cols-4", className)}
    >
      <MaleVsFemaleCount
        title={t("totalNumberOfStudents")}
        maleCount={studentsCount.male || 0}
        femaleCount={studentsCount.female || 0}
        totalCount={studentsCount.total || 0}
      />
      <MaleVsFemaleCount
        title={t("registeredStudents")}
        maleCount={enrollmentsCount?.male || 0}
        femaleCount={enrollmentsCount?.female || 0}
        totalCount={enrollmentsCount?.total || 0}
      />
      <MaleVsFemaleCount
        title={t("registeredStudents")}
        maleCount={enrollmentsCount?.male || 0}
        femaleCount={enrollmentsCount?.female || 0}
        totalCount={enrollmentsCount?.total || 0}
      />
      <MaleVsFemaleCount
        title={t("registeredStudents")}
        maleCount={enrollmentsCount?.male || 0}
        femaleCount={enrollmentsCount?.female || 0}
        totalCount={enrollmentsCount?.total || 0}
      />

      {/* {contactsCount && (
        <EffectiveStatCard
          index={3}
          title={t("totalNumberOfContacts")}
          total={contactsCount?.total}
          //iconFill="bg-[#F7F0F0] text-[#5F27CD] dark:bg-[#5F27CD]/10 dark:text-[#5F27CD]"
          secondTotal={registeredContactsCount?.total}
          icon={<PiUser className="h-auto w-[28px]" strokeWidth={4} />}
        />
      )}
      {staffsCount && (
        <EffectiveStatCard
          index={4}
          //iconFill="bg-green-100 text-green-800 dark:bg-green-400 dark:text-green-100"
          title={t("totalNumberOfStaffs")}
          total={staffsCount?.total}
          active={staffsCount?.active}
          inactive={staffsCount?.inactive}
          icon={<PiUserList className="h-auto  w-[28px]" strokeWidth={4} />}
        />
      )} */}
    </div>
  );
}
