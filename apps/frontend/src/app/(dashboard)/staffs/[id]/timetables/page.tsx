import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { StaffTimetablesCalendar } from "./StaffTimetablesCalendar";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staffId = params.id;

  batchPrefetch([
    trpc.staff.timetables.queryOptions(staffId),
    trpc.staff.get.queryOptions(staffId),
  ]);

  return (
    <HydrateClient>
      <div className="flex flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="mx-4 h-[700px] w-full" />}>
            <StaffTimetablesCalendar staffId={staffId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
