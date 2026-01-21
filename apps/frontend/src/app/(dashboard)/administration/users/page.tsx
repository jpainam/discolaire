import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { UserDataTableV2Test } from "~/components/administration/users/UserDataTableV2Test";
import { ErrorFallback } from "~/components/error-fallback";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { PlusIcon } from "~/icons";
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
        <div className="flex items-center gap-4 px-4 py-2">
          <Label>{t("users")} - DataTable v2</Label>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild>
              <Link href={`/administration/users/create`}>
                <PlusIcon /> Ajouter
              </Link>
            </Button>
          </div>
        </div>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex flex-col gap-2 px-4">
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
