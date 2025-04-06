import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ContactDataTable } from "~/components/contacts/ContactDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Page() {
  prefetch(trpc.contact.all.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={"contacts"}
          fallback={
            <div className="grid grid-cols-4 p-4 gap-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          }
        >
          <div className="px-4">
            <ContactDataTable />
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
