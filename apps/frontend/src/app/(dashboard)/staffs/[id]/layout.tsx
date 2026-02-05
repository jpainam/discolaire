import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { StaffDetails } from "~/components/staffs/profile/StaffDetails";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const params = await props.params;
  const queryClient = getQueryClient();
  batchPrefetch([
    trpc.staff.get.queryOptions(params.id),
    trpc.role.all.queryOptions(),
  ]);
  const staff = await queryClient.fetchQuery(
    trpc.staff.get.queryOptions(params.id),
  );
  const t = await getTranslations();

  return (
    <HydrateClient>
      <div className="flex flex-col">
        <BreadcrumbsSetter
          items={[
            { label: t("home"), href: "/" },
            { label: t("staffs"), href: "/staffs" },
            { label: getFullName(staff) },
          ]}
        />
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 8 }).map((_, t) => (
                  <Skeleton className="h-8" key={t} />
                ))}
              </div>
            }
          >
            <StaffDetails staffId={params.id} />
          </Suspense>
        </ErrorBoundary>
        {props.children}
      </div>
    </HydrateClient>
  );
}
