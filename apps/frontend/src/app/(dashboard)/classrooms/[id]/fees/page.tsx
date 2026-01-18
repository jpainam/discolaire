import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomFeeHeader } from "~/components/classrooms/fees/ClassroomFeeHeader";
import { ClassroomFeeTable } from "~/components/classrooms/fees/ClassroomFeeTable";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  // const canReadClassroomFee = await checkPermission(
  //   "fee",
  //   "read",
  // );
  // if (!canReadClassroomFee) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  void batchPrefetch([
    trpc.classroom.fees.queryOptions(id),
    trpc.classroom.get.queryOptions(params.id),
  ]);
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            <ClassroomFeeHeader />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            }
          >
            <ClassroomFeeTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
