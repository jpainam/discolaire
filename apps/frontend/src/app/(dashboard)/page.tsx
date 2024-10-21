import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { getServerTranslations } from "@repo/i18n/server";

import { DashboardClassroomSize } from "~/components/dashboard/DashboardClassroomSize";
import { DashboardTransactionTrend } from "~/components/dashboard/DashboardTransactionTrend";
import { EducationalRessource } from "~/components/dashboard/EducationalRessource";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";

export default async function Page() {
  // const signedUrl = await fetch(
  //   "http://localhost:3000/api/upload?key=avatars/011ece07-f378-47de-bbe5-d1cb8618dd8e"
  // );
  // console.log(signedUrl);
  // const data = await signedUrl.json();
  // const grades = await reportCardService.getGrades(
  //   "2b030158-4304-4dba-a6be-b99c5c6c26b9",
  //   43
  // );
  //const staff = await api.staff.all();
  const { t } = await getServerTranslations();

  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:pt-[110px] 2xl:grid-cols-12">
      <div className="col-span-full text-lg font-bold md:text-2xl">
        {t("dashboard")}
      </div>
      <QuickStatistics />
      {/* <SearchBlock className="col-span-full md:col-span-6" /> */}
      <SchoolLife />
      <ScheduleCard />
      <EducationalRessource />
      {/* <Suspense>
        <EffectiveStat className="col-span-full" />
      </Suspense> */}
      {/*<ContactCard className="col-span-4" /> */}

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
      <DashboardClassroomSize className="col-span-full hidden md:block" />
      <DashboardTransactionTrend className="col-span-full hidden md:block" />
      {/*
        <ClassroomEffectiveStats className="text-sm col-span-8" />
        <GenderStats className="col-span-4" /> */}
    </div>
  );
}
{
  /* <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7">
      <JobStats className="col-span-full" /> */
}
