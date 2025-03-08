import { EducationalRessource } from "~/components/dashboard/EducationalRessource";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";

export default function Page() {
  return (
    <div className="lg:grid flex flex-col grid-cols-2 gap-4 p-4">
      <QuickStatistics className="col-span-full" />
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
      {/* <DashboardClassroomSize className="col-span-full hidden md:block" />
      <DashboardTransactionTrend className="col-span-full hidden md:block" /> */}
    </div>
  );
}
