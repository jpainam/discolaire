import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { StudentDataTable } from "~/components/students/StudentDataTable";

import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { StudentPageHeader } from "./StudentPageHeader";
import { StudentStats } from "./StudentStats";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  void batchPrefetch([trpc.student.all.queryOptions()]);

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
          <StudentPageHeader />
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
          key={"student-table"}
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <StudentDataTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
