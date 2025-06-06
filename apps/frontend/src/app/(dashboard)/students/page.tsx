import { redirect } from "next/navigation";

import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentDataTable } from "~/components/students/StudentDataTable";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { StudentHeader } from "./StudentHeader";
import { StudentSearchPage } from "./StudentSearchPage";
import { StudentStats } from "./StudentStats";
import { getSession } from "~/auth/server";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  //void prefetch(trpc.student.search.queryOptions({}));

  batchPrefetch([trpc.enrollment.count.queryOptions({})]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={"students"}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StudentHeader />
        </Suspense>
      </ErrorBoundary>
      {session.user.profile == "staff" && (
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={"student-stats"}
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <StudentStats />
          </Suspense>
        </ErrorBoundary>
      )}
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          {session.user.profile == "staff" ? (
            <StudentSearchPage />
          ) : (
            <StudentDataTable />
          )}
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
