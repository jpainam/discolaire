import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { BookUser, Building2, UserCheck, Users } from "lucide-react";

import { QuickStudentList } from "~/components/dashboard/QuickStudentList";
import { RecentActivitiesDashboard } from "~/components/dashboard/RecentActivitiesDashboard";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassList } from "./class-list";
import { NotesChart } from "./notes-chart";
import { StatsCard } from "./stats-card";

export default function Page() {
  batchPrefetch([
    trpc.gradeSheet.getLatestGradesheet.queryOptions({ limit: 20 }),
    trpc.classroom.all.queryOptions(),
    trpc.enrollment.count.queryOptions({}),
    trpc.contact.count.queryOptions(),
    trpc.staff.count.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="bg-background flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatsCard
            label="Total des élèves"
            value="2 749"
            icon={<Users className="h-5 w-5" />}
            color="primary"
          />
          <StatsCard
            label="Total des personnels"
            value="289"
            icon={<UserCheck className="h-5 w-5" />}
            color="accent"
          />
          <StatsCard
            label="Total des classes"
            value="75"
            icon={<Building2 className="h-5 w-5" />}
            color="success"
          />
          <StatsCard
            label="Total des contacts"
            value="2 550"
            icon={<BookUser className="h-5 w-5" />}
            color="warning"
          />
        </div>

        {/* Middle row: Chart + Classes + Recent Activities */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Notes chart – takes 5 cols */}
          <div className="lg:col-span-5">
            <NotesChart />
          </div>
          {/* Class list – takes 4 cols */}
          <div className="lg:col-span-4">
            <ClassList />
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
