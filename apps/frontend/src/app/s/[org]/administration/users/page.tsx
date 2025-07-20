import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";

import { UserDataTable } from "~/components/administration/users/UserDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { getServerTranslations } from "~/i18n/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page() {
  const { t } = await getServerTranslations();
  prefetch(trpc.user.all.queryOptions({}));
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex flex-col gap-2 p-4">
          <Label>{t("users")}</Label>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8" />
                ))}
              </div>
            }
          >
            <UserDataTable />
          </Suspense>
        </div>
      </ErrorBoundary>
    </HydrateClient>
  );
}
