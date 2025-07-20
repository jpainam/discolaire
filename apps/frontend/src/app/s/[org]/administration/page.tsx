import { Suspense } from "react";
import { addMonths, subMonths } from "date-fns";

import { Skeleton } from "@repo/ui/components/skeleton";

//import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
import { TransactionSummaryCard } from "~/components/administration/TransactionSummaryCard";
//import { RecentActivities } from "~/components/administration/RecentActivities";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default function Page() {
  //const { t } = await getServerTranslations();
  batchPrefetch([
    trpc.transaction.getTransactionSummary.queryOptions({
      from: subMonths(new Date(), 3),
      to: addMonths(new Date(), 1),
    }),
  ]);
  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 px-4 py-2">
        <Suspense
          key={"quick-statistics"}
          fallback={
            <div className="col-span-full grid gap-4 lg:grid-cols-4">
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
            <TransactionSummaryCard
              endDate={addMonths(new Date(), 1)}
              startDate={subMonths(new Date(), 3)}
            />
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
