import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { CreateEditUser } from "./CreateEditUser";

export default async function Page() {
  batchPrefetch([trpc.userRole.all.queryOptions()]);
  const t = await getTranslations();
  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("administration"), href: "/administration" },
          { label: t("users"), href: "/administration/users" },
          { label: t("create"), href: "/administration/users/create" },
        ]}
      />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <CreateEditUser />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
