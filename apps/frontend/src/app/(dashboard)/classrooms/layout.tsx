import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { Suspense } from "react";

import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Layout({ children }: { children: React.ReactNode }) {
  prefetch(trpc.classroom.all.queryOptions());
  return (
    <div className="flex flex-1 flex-col">
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            <ClassroomHeader />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      {children}
    </div>
  );
}
