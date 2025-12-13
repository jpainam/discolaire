import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
//import { ClassroomStatistics } from "~/components/administration/ClassroomStatistics";
//import { RecentActivities } from "~/components/administration/RecentActivities";
import { getTranslations } from "next-intl/server";

import { GradeDistributionChart } from "~/components/administration/grade-reports/GradeDistributionChart";
import { RecentGradesTable } from "~/components/administration/grade-reports/RecentGradesTable";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ErrorFallback } from "~/components/error-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { LatestAttendanceTable } from "./attendances/LatestAttendanceTable";

export default async function Page() {
  //const t = await getTranslations();
  const t = await getTranslations();
  batchPrefetch([
    trpc.gradeSheet.distribution.queryOptions(),
    trpc.attendance.all.queryOptions({}),
  ]);
  const queryClient = getQueryClient();
  const count = await queryClient.fetchQuery(
    trpc.enrollment.count.queryOptions({}),
  );
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
        {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-24 w-full" />}>
            <TransactionSummaryCard
              endDate={addMonths(new Date(), 1)}
              startDate={subMonths(new Date(), 3)}
            />
          </Suspense>
        </div> */}

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
      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Recent Grades")}</CardTitle>
            <CardDescription className="text-xs">
              {t("Latest grades entered into the system")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              }
            >
              <RecentGradesTable />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>
              {t("Grade Distribution")} - {count.total} {t("students")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("Distribution of grades across all students")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<Skeleton className="h-48" />}>
                <GradeDistributionChart />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-2 px-4 py-2 lg:grid-cols-7">
        <div className="col-span-3"></div>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="col-span-4 grid grid-cols-1 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <LatestAttendanceTable className="col-span-4" />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
