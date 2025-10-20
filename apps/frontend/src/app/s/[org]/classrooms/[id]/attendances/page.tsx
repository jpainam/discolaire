import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomAttendanceTable } from "./ClassroomAttendanceTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  batchPrefetch([
    trpc.attendance.all.queryOptions({
      classroomId: params.id,
    }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ClassroomAttendanceTable classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
