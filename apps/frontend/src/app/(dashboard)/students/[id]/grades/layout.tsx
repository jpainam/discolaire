import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@repo/ui/components/skeleton";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentGrade } from "~/components/students/grades/StudentGrade";
import { StudentGradeHeader } from "~/components/students/grades/StudentGradeHeader";
import {
  batchPrefetch,
  caller,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ term?: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;
  const queryClient = getQueryClient();

  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId: id }),
  );
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(id),
  );
  const t = await getTranslations();
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  const grades = await caller.student.grades({
    id: params.id,
  });
  if (grades.length === 0) {
    return <EmptyComponent title={t("no_data")} />;
  }
  //const searchParams = await props.searchParams;
  //const term = searchParams?.term;
  batchPrefetch([
    trpc.term.all.queryOptions(),
    trpc.student.grades.queryOptions({
      id: params.id,
    }),
    trpc.classroom.getMinMaxMoyGrades.queryOptions(classroom.id),
  ]);

  return (
    <HydrateClient>
      <div className="flex h-full w-full flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={student.id}
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            <StudentGradeHeader classroomId={classroom.id} />
          </Suspense>
        </ErrorBoundary>
        <div className="grid gap-0 p-0 pb-2 text-sm md:grid-cols-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              key={student.id}
              fallback={
                <div className="grid grid-cols-[80%_15%] gap-4 p-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              }
            >
              <StudentGrade classroomId={classroom.id} />
            </Suspense>
          </ErrorBoundary>
          {children}
        </div>
      </div>
    </HydrateClient>
  );
}
