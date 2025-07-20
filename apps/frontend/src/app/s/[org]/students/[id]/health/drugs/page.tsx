import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, trpc } from "~/trpc/server";
import { prefetch } from "../../../../../../../trpc/server";
import { DrugHeader } from "./DrugHeader";
import { DrugTable } from "./DrugTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.health.drugs.queryOptions({ studentId: params.id }));
  return (
    <HydrateClient>
      <Suspense
        key={params.id}
        fallback={
          <div className="px-4 py-2">
            <Skeleton className="h-8" />
          </div>
        }
      >
        <DrugHeader />
      </Suspense>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <DrugTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
