import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ClassroomFeeHeader } from "~/components/classrooms/fees/ClassroomFeeHeader";
import { ClassroomFeeTable } from "~/components/classrooms/fees/ClassroomFeeTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  // const canReadClassroomFee = await checkPermission(
  //   "fee",
  //   PermissionAction.READ,
  // );
  // if (!canReadClassroomFee) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  void prefetch(trpc.classroom.fees.queryOptions(id));
  return (
    <div className="flex flex-col gap-2">
      <Suspense
        key={params.id}
        fallback={<Skeleton className="h-8 w-full px-4" />}
      >
        <ClassroomFeeHeader />
      </Suspense>

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full " />
                ))}
              </div>
            }
          >
            <ClassroomFeeTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
