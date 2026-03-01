import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { QuickClassroomList } from "~/components/dashboard/QuickClassroomList";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { QuickStudentList } from "~/components/dashboard/QuickStudentList";
import { RecentActivitiesDashboard } from "~/components/dashboard/RecentActivitiesDashboard";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { NotesChart } from "./notes-chart";

export default function Page() {
  batchPrefetch([
    trpc.gradeSheet.getLatestGradesheet.queryOptions({ limit: 20 }),
    trpc.classroom.all.queryOptions(),
    trpc.enrollment.count.queryOptions({}),
    trpc.staff.count.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
       
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          }
        >
          <QuickStatistics />
        </Suspense>

        {/* Middle row: Chart + Classes + Recent Activities */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Notes chart – takes 5 cols */}
          <div className="lg:col-span-5">
            <NotesChart />
          </div>
          {/* Class list – takes 4 cols */}
          <div className="lg:col-span-4">
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <QuickClassroomList />
            </Suspense>
          </div>
          {/* Recent activities – takes 3 cols */}
          <div className="lg:col-span-3">
            <RecentActivitiesDashboard />
          </div>
        </div>

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 px-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            }
          >
            <QuickStudentList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
