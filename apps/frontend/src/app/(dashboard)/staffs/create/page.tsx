import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { Skeleton } from "~/components/ui/skeleton";
import { checkPermission } from "~/permissions/server";
import { HydrateClient } from "~/trpc/server";
import CreateEditStaff from "./CreateEditStaff";

export default async function Page() {
  const canCreateStaff = await checkPermission("staff.create");
  if (!canCreateStaff) {
    return <NoPermission />;
  }

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid gap-4 p-4 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton className="h-20" key={index} />
              ))}
            </div>
          }
        >
          <CreateEditStaff />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
