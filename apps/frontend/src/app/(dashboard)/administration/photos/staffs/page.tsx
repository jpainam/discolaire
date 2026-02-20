import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { PhotoStaffList } from "../../../../../components/administration/photos/PhotoStaffList";

export default async function Page() {
  prefetch(trpc.photo.staffs.queryOptions({ pageIndex: 1 }));
  const t = await getTranslations();

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("administration"), href: "/administration" },
          { label: t("photos"), href: "/administration/photos" },
          { label: t("staffs"), href: "/administration/photos/staffs" },
        ]}
      />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <PhotoStaffList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
