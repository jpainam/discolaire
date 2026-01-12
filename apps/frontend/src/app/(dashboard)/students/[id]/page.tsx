import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentAttendanceSummary } from "~/components/students/attendances/StudentAttendanceSummary";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import { StudentGradeCount } from "~/components/students/grades/StudentGradeCount";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { StudentGradesheetChart } from "./gradesheets/StudentGradesheetChart";
import { StudentGradesheetTable } from "./gradesheets/StudentGradesheetTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.student.siblings.queryOptions(params.id),
    trpc.student.get.queryOptions(params.id),
    trpc.student.contacts.queryOptions(params.id),
    trpc.student.grades.queryOptions({ id: params.id }),
    trpc.attendance.student.queryOptions({ studentId: params.id }),
    trpc.student.grades.queryOptions({ id: params.id }),
    trpc.student.classroom.queryOptions({ studentId: params.id }),
    trpc.term.all.queryOptions(),
  ]);
  const queryClient = getQueryClient();
  const terms = await queryClient.fetchQuery(trpc.term.all.queryOptions());
  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );

  return (
    <HydrateClient>
      <div className="grid grid-cols-1 divide-x border-b lg:grid-cols-6">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="grid gap-4 px-4 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            }
          >
            <StudentDetails className="col-span-full lg:col-span-3" />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="flex flex-col gap-4 pt-2 lg:col-span-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            }
          >
            <StudentGradeCount
              className={"col-span-2 px-2"}
              studentId={params.id}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="flex flex-col gap-4 pt-2 pr-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            }
          >
            <StudentAttendanceSummary studentId={params.id} />
            {/* <StudentAttendanceCount terms={terms} studentId={params.id} /> */}
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="divide-border grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col gap-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              key={params.id}
              fallback={
                <div className="px-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              }
            >
              <StudentContactTable studentId={params.id} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              }
            >
              <StudentGradesheetTable
                className="py-0"
                tableClassName="border-t"
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-20" />}>
              {classroom && (
                <StudentGradesheetChart
                  defaultTerm={terms[0]?.id ?? ""}
                  classroomId={classroom.id}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  );
}
