import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ContactTimetablesCalendar } from "./ContactTimetablesCalendar";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([trpc.contact.timetables.queryOptions(params.id)]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="m-4 h-[700px] w-full" />}>
          <ContactTimetablesCalendar contactId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
