import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { StaffDocumentHeader } from "./StaffDocumentHeader";
import { StaffDocumentTable } from "./StaffDocumentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.staff.documents.queryOptions(params.id));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StaffDocumentHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid md:grid-cols-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <StaffDocumentTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
