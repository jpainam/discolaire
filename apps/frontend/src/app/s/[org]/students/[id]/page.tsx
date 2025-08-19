import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentContactTable } from "~/components/students/contacts/StudentContactTable";
import StudentDetails from "~/components/students/profile/StudentDetails";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([
    trpc.student.siblings.queryOptions(params.id),
    trpc.student.get.queryOptions(params.id),
    trpc.student.contacts.queryOptions(params.id),
  ]);

  return (
    <HydrateClient>
      <div className="grid grid-cols-3 gap-4 divide-x divide-y">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={
              <div className="col-span-2 grid grid-cols-3 gap-4 px-4">
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
          <div>Autre details sur les notes</div>
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
          <div>Autre details sur les notes</div>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
