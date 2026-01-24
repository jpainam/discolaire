import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  BookOpenCheck,
  CalendarDays,
  CircleDollarSign,
  Folders,
  History,
  KeySquare,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { StaffGradesheetTable } from "~/components/staffs/profile/StaffGradesheetTable";
import { StaffTeachingTable } from "~/components/staffs/StaffTeachingTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GradeIcon } from "~/icons";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ActivityTimeline } from "./ActivityTimeline2";
import { ClassPerformance } from "./ClassPerformance";
import { PendingTasks } from "./PendingTasks";
import { StaffPermissionTable } from "./permissions/StaffPermissionTable";
import { QuickActions } from "./QuickActions";
import { StatsCards } from "./StatsCards";
import { TodaySchedule } from "./TodaySchedule";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tabId?: string }>;
}) {
  const params = await props.params;
  const staffId = params.id;
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  batchPrefetch([
    trpc.staff.subjects.queryOptions(staffId),
    trpc.staff.gradesheets.queryOptions(staffId),
    trpc.staff.permissions.queryOptions(staffId),
    trpc.module.all.queryOptions(),
    trpc.permission.all.queryOptions(),
    trpc.subject.gradesheetCount.queryOptions({ teacherId: staffId }),
    trpc.staff.stats.queryOptions(staffId),
  ]);
  return (
    <HydrateClient>
      <Tabs defaultValue={searchParams.tabId ?? "timeline"} className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">
            <History className="h-4 w-4" />
            {t("timeline")}
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <KeySquare className="h-4 w-4" />
            {t("permissions")}
          </TabsTrigger>
          <TabsTrigger value="teachings">
            <BookOpenCheck />
            {t("teachings")}
          </TabsTrigger>
          <TabsTrigger value="timetables">
            <CalendarDays /> {t("timetables")}
          </TabsTrigger>
          <TabsTrigger value="grades">
            <GradeIcon />
            {t("grades")}
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <CircleDollarSign className="h-4 w-4" /> {t("payroll")}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Folders className="h-4 w-4" /> {t("documents")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <div className="space-y-4">
            <StatsCards staffId={staffId} />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <ClassPerformance />
              </div>

              <div className="lg:col-span-2">
                <ActivityTimeline />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>

              {/* Pending Tasks */}
              <div className="lg:col-span-1">
                <PendingTasks />
              </div>

              {/* Class Performance */}
              <div className="lg:col-span-1">
                <TodaySchedule />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachings">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={3} cols={4} />}>
              <StaffTeachingTable staffId={params.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="timetables">timetables</TabsContent>
        <TabsContent value="grades">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={8} cols={4} />}>
              <StaffGradesheetTable staffId={params.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="permissions">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
              <StaffPermissionTable staffId={staffId} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="payroll">payroll</TabsContent>
        <TabsContent value="documents">documents</TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
