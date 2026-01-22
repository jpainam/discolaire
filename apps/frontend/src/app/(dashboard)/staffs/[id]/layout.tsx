import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { getFullName } from "~/utils";
import { StaffDetails } from "../../../../components/staffs/profile/StaffDetails";

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
      <div className="flex flex-col gap-4 px-4 py-2">
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
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="flex-1">{props.children}</div>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-20 w-[200px]" />}>
              {/* <ShortCalendar /> */}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  );
}
