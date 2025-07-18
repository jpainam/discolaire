import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { NotificationPreferences } from "./NotificationPreferences";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(
    trpc.notificationPreference.user.queryOptions({ userId: params.id }),
  );
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 " />
              ))}
            </div>
          }
        >
          <NotificationPreferences />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
