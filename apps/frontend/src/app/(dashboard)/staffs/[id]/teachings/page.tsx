import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { StaffTeachingTable } from "~/components/staffs/StaffTeachingTable";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staffId = params.id;

  batchPrefetch([
    trpc.subject.gradesheetCount.queryOptions({ teacherId: staffId }),
    trpc.staff.subjects.queryOptions(staffId),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={3} cols={4} />}>
          <StaffTeachingTable staffId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
