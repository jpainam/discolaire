import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { LogActivityList } from "~/components/log-activities/LogActivityList";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassPerformance } from "./ClassPerformance";
import { PendingTasks } from "./PendingTasks";
import { QuickActions } from "./QuickActions";
import { StatsCards } from "./StatsCards";
import { TodaySchedule } from "./WeekSchedule";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tabId?: string }>;
}) {
  const params = await props.params;
  const staffId = params.id;
  batchPrefetch([
    trpc.staff.subjects.queryOptions(staffId),
    trpc.staff.gradesheets.queryOptions(staffId),
    trpc.staff.permissions.queryOptions(staffId),
    trpc.module.all.queryOptions(),
    trpc.staff.timelines.queryOptions(staffId),
    trpc.permission.all.queryOptions(),
    trpc.term.all.queryOptions(),
    trpc.subject.gradesheetCount.queryOptions({ teacherId: staffId }),
    trpc.staff.stats.queryOptions(staffId),
    trpc.staff.timetables.queryOptions(staffId),
  ]);
  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid gap-4 p-4 xl:grid-cols-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <StatsCards staffId={staffId} />
          </Suspense>
        </ErrorBoundary>
        <div className="grid gap-4 px-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-4 p-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                }
              >
                <ClassPerformance staffId={staffId} />
              </Suspense>
            </ErrorBoundary>
          </div>

          <div className="lg:col-span-2">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-2">
                    {Array.from({ length: 4 }).map((_, t) => (
                      <Skeleton className="h-10" key={t} />
                    ))}
                  </div>
                }
              >
                <LogActivityList entityId={staffId} entityType="staff" />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 px-4 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Pending Tasks */}
          <div className="lg:col-span-1">
            <PendingTasks />
          </div>

          {/* Week Schedule */}
          <div className="lg:col-span-1">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-2">
                    {Array.from({ length: 4 }).map((_, t) => (
                      <Skeleton className="h-10" key={t} />
                    ))}
                  </div>
                }
              >
                <TodaySchedule staffId={staffId} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
