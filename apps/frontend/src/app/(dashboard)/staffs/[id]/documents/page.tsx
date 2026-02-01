import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { DocumentOverview } from "~/components/documents/DocumentOverview";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { StaffDocumentHeader } from "./StaffDocumentHeader";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.staff.documents.queryOptions(params.id));
  const staff = await caller.staff.get(params.id);

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
          <StaffDocumentHeader staffId={staff.id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid gap-4 px-4 py-2 md:grid-cols-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <DocumentOverview entityId={params.id} entityType="staff" />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
