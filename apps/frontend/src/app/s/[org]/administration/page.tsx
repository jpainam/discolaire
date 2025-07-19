import { Skeleton } from "@repo/ui/components/skeleton";
import { Suspense } from "react";
//import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { TransactionSummaryCard } from "~/components/administration/TransactionSummaryCard";
//import { RecentActivities } from "~/components/administration/RecentActivities";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { HydrateClient } from "~/trpc/server";

export default function Page() {
  //const { t } = await getServerTranslations();
  return (
    <HydrateClient>
      <div className="px-4 py-2 flex flex-col gap-4">
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
          <QuickStatistics />
        </Suspense>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-24 w-full" />}>
            <TransactionSummaryCard />
          </Suspense>
        </div>

        {/* <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <LatestTransactions />
      </Suspense>
      <Card>
        <CardContent>
          <ShortCalendar />
        </CardContent>
      </Card> */}

        {/* <div className="grid grid-cols-1 gap-2 px-2 xl:grid-cols-12">
        <ClassroomStatistics className="col-span-5" />
        <RecentActivities />
      </div> */}
      </div>
    </HydrateClient>
  );
}
