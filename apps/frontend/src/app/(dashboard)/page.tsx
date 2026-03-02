import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { decode } from "entities";

import { getSession } from "~/auth/server";
import { QuickChartCard } from "~/components/dashboard/QuickChartCard";
import { QuickClassroomList } from "~/components/dashboard/QuickClassroomList";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { QuickStudentList } from "~/components/dashboard/QuickStudentList";
import { RecentActivitiesDashboard } from "~/components/dashboard/RecentActivitiesDashboard";
import { Chart01 } from "~/components/dashboard/student/Chart01";
import { StudentGradeTrend } from "~/components/dashboard/student/StudentGradeTrend";
import { StudentTransactionStat } from "~/components/dashboard/student/StudentTransactionStats";
import { StudentDashboardContact } from "~/components/dashboard/StudentDashboardContact";
import { StudentLatestGrade } from "~/components/dashboard/StudentLatestGrade";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const queryClient = getQueryClient();

  if (session.user.profile === "student") {
    const student = await queryClient.fetchQuery(
      trpc.student.getFromUserId.queryOptions(session.user.id),
    );
    const grades = await queryClient.fetchQuery(
      trpc.student.grades.queryOptions({ id: student.id }),
    );
    const subjects = Array.from(
      new Map(
        grades.map((grade) => [
          grade.gradeSheet.subjectId,
          {
            id: grade.gradeSheet.subjectId,
            name:
              grade.gradeSheet.subject.course.reportName ||
              grade.gradeSheet.subject.course.name,
          },
        ]),
      ).values(),
    );

    return (
      <div className="grid w-full gap-4 p-4 lg:grid-cols-2">
        <StudentTransactionStat
          studentId={student.id}
          className="col-span-full"
        />
        <StudentLatestGrade
          studentId={student.id}
          name={decode(student.lastName ?? "")}
        />
        <StudentGradeTrend
          subjects={subjects}
          data={grades.map((g) => ({
            subjectId: g.gradeSheet.subjectId,
            maxGrade: g.gradeSheet.scale,
            grade: g.grade,
          }))}
        />
        <Chart01 />
        <StudentDashboardContact studentId={student.id} />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="grid gap-4 self-start lg:col-span-9 lg:grid-cols-12">
            <div className="h-full lg:col-span-6">
              <ErrorBoundary errorComponent={ErrorFallback}>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 gap-4">
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                    </div>
                  }
                >
                  <QuickChartCard />
                </Suspense>
              </ErrorBoundary>
            </div>
            {/* Class list – takes 4 cols */}
            <div className="h-full lg:col-span-6">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <QuickClassroomList />
              </Suspense>
            </div>
            <div className="col-span-full">
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
          </div>
          {/* Recent activities – takes 3 cols */}
          <div className="h-full lg:col-span-3">
            <RecentActivitiesDashboard />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
