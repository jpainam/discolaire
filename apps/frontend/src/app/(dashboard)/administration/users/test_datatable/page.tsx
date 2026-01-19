import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { UserDataTableV2Test } from "~/components/administration/users/UserDataTableV2Test";
import { ErrorFallback } from "~/components/error-fallback";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page() {
  const t = await getTranslations();
  prefetch(
    trpc.user.all.infiniteQueryOptions(
      {
        pageSize: 10,
        search: "",
        filters: [],
        sorting: [],
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    ),
  );
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex flex-col gap-2 p-4">
          <Label>{t("users")} - DataTable v2</Label>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8" />
                ))}
              </div>
            }
          >
            <UserDataTableV2Test />
          </Suspense>
        </div>
      </ErrorBoundary>
    </HydrateClient>
  );
}
