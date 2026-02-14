import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { StudentAssignmentTable } from "~/components/students/assignments/StudentAssignementTable";
import { StudentAssignmentHeader } from "~/components/students/assignments/StudentAssignmentHeader";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;
  const queryClient = getQueryClient();

  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId: id }),
  );
  const t = await getTranslations();
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  batchPrefetch([trpc.classroom.assignments.queryOptions(classroom.id)]);

  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-8" />}>
            <StudentAssignmentHeader />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<TableSkeleton rows={4} cols={5} />}>
            <StudentAssignmentTable classroomId={classroom.id} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
