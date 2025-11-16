import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { CommunicationChannelList } from "./CommunicationChannelList";
import { CommunicationHeader } from "./CommunicationHeader";

export default function Page() {
  batchPrefetch([trpc.communicationChannel.all.queryOptions()]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-8 w-full" />}>
          <CommunicationHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <CommunicationChannelList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
