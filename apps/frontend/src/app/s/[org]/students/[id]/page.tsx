import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentAttendanceCount } from "~/components/students/attendances/StudentAttendanceCount";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import { StudentGradeCount } from "~/components/students/grades/StudentGradeCount";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.student.siblings.queryOptions(params.id),
    trpc.student.get.queryOptions(params.id),
    trpc.student.contacts.queryOptions(params.id),
    trpc.student.grades.queryOptions({ id: params.id }),
    trpc.absence.byStudent.queryOptions({ studentId: params.id }),
    trpc.lateness.byStudent.queryOptions({ studentId: params.id }),
    trpc.chatter.byStudent.queryOptions({ studentId: params.id }),
    trpc.consigne.byStudent.queryOptions({ studentId: params.id }),
  ]);

  return (
    <HydrateClient>
      <div className="grid grid-cols-4 gap-4 divide-x border-b">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="grid grid-cols-3 gap-4 px-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            }
          >
            <StudentDetails className="col-span-2" />
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
            <StudentGradeCount studentId={params.id} />
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
            <StudentAttendanceCount studentId={params.id} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="grid grid-cols-2 gap-4 py-2">
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
          <div></div>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
