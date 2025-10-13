import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { decode } from "entities";

import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { DashboardClassroomSize } from "~/components/dashboard/DashboardClassroomSize";
import { EducationalResource } from "~/components/dashboard/EducationalResource";
import { LatestGradesheet } from "~/components/dashboard/LatestGradesheet";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";
import { Chart01 } from "~/components/dashboard/student/Chart01";
import { StudentGradeTrend } from "~/components/dashboard/student/StudentGradeTrend";
import { StudentTransactionStat } from "~/components/dashboard/student/StudentTransactionStats";
import { StudentDashboardContact } from "~/components/dashboard/StudentDashboardContact";
import { StudentLatestGrade } from "~/components/dashboard/StudentLatestGrade";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, caller, HydrateClient, trpc } from "~/trpc/server";

export default async function Page() {
  const session = await getSession();

  if (session?.user.profile === "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    const grades = await caller.student.gradeTrends(student.id);
    const subjects = grades.map((grade) => ({
      id: grade.subjectId,
      name: grade.name,
    }));

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
          data={grades.map((g) => {
            return {
              subjectId: g.subjectId,
              maxGrade: g.maxGrade ?? 0,
              grade: g.grade,
            };
          })}
        />
        <Chart01 />

        <StudentDashboardContact studentId={student.id} />
      </div>
    );
  }

  batchPrefetch([
    trpc.gradeSheet.getLatestGradesheet.queryOptions({ limit: 15 }),
    trpc.classroom.all.queryOptions(),
  ]);

  return (
    <div className="@container grid flex-1 gap-2 px-4 py-2 md:grid-cols-2 2xl:grid-cols-2">
      <Suspense
        key={"quick-statistics"}
        fallback={
          <div className="col-span-full grid grid-cols-1 gap-4 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="hidden h-24 w-full lg:flex" />
            <Skeleton className="hidden h-24 w-full lg:flex" />
            <Skeleton className="hidden h-24 w-full lg:flex" />
          </div>
        }
      >
        <QuickStatistics />
      </Suspense>
      {/* <SearchBlock className="col-span-full md:col-span-6" /> */}
      {/* <SchoolFeed /> */}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-60 w-full" />}>
            <LatestGradesheet />
          </Suspense>
        </ErrorBoundary>

        <Suspense fallback={<Skeleton className="h-60 w-full" />}>
          <SchoolLife />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-60 w-full" />}>
          <ScheduleCard />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-60 w-full" />}>
          <EducationalResource />
        </Suspense>
        {/* <EffectiveStat className="col-span-full" />

      <ContactCard className="col-span-4" />

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={"classroom-size"}
            fallback={
              <Skeleton className="col-span-full hidden h-60 w-full md:block" />
            }
          >
            <DashboardClassroomSize className="col-span-full hidden md:block" />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      {/* <UpcomingAssignment /> */}
      {/* <TransactionStat /> */}
      {/* <DashboardTransactionTrend className="col-span-full hidden md:block" /> */}
    </div>
  );
}
