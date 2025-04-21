import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  //const { t } = await getServerTranslations();
  prefetch(trpc.health.visits.queryOptions({ userId: student.id }));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-8" />}>
          <HealthVisitHeader userId={student.userId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-3 gap-4 px-4 py-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-8 " />
              ))}
            </div>
          }
        >
          <HealthVisitTable
            name={getFullName(student)}
            userId={student.userId ?? "N/A"}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
