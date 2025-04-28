import { Skeleton } from "@repo/ui/components/skeleton";
import { Suspense } from "react";
//import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { LatestTransactions } from "~/components/administration/LatestTransactions";
//import { RecentActivities } from "~/components/administration/RecentActivities";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";

export default function Page() {
  //const { t } = await getServerTranslations();
  return (
    <div className="grid md:grid-cols-2 p-4 flex-col gap-4">
      <Suspense
        key={"quick-statistics"}
        fallback={
          <div className="col-span-full grid lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        }
      >
        <QuickStatistics className="col-span-full" />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <LatestTransactions />
      </Suspense>

      {/* <div className="grid grid-cols-1 gap-2 px-2 xl:grid-cols-12">
        <ClassroomStatistics className="col-span-5" />
        <RecentActivities />
      </div> */}
    </div>
  );
}
