import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { Skeleton } from "~/components/ui/skeleton";
import { checkPermission } from "~/permissions/server";
import { HydrateClient } from "~/trpc/server";
import { CreateEditStudent } from "./CreateEditStudent";
import { StudentFormProvider } from "./StudentFormContext";

export default async function Page() {
  const canCreateStudent = await checkPermission("student.create");
  if (!canCreateStudent) {
    return <NoPermission />;
  }
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <StudentFormProvider>
            <CreateEditStudent />
          </StudentFormProvider>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
