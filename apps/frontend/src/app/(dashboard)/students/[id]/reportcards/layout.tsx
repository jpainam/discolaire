import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { ReportCardHeader } from "~/components/students/reportcards/ReportCardHeader";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient } from "~/trpc/server";

export default function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Suspense fallback={null}>
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="px-4 py-2">
                  <Skeleton className="h-8" />
                </div>
              }
            >
              <ReportCardHeader />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </Suspense>
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 px-4 py-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        }
      >
        {props.children}
      </Suspense>
    </div>
  );
}
