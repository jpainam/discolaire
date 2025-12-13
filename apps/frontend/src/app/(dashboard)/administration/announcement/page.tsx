import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { AnnouncementDataTable } from "~/components/administration/announcement/AnnouncementDataTable";
import { AnnouncementHeader } from "~/components/administration/announcement/AnnouncementHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Separator } from "~/components/ui/separator";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default function Page() {
  batchPrefetch([trpc.announcement.all.queryOptions()]);
  return (
    <div className="flex w-full flex-col">
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense>
            <AnnouncementHeader />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      <Separator />
      <AnnouncementDataTable />
    </div>
  );
}
