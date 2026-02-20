import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { env } from "~/env";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { PhotoStudentList } from "../../../../../components/administration/photos/PhotoStudentList";

export default async function Page() {
  prefetch(
    trpc.photo.listObjects.queryOptions({
      prefix: "student/",
      bucket: env.S3_AVATAR_BUCKET_NAME,
    }),
  );
  const t = await getTranslations();

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("administration"), href: "/administration" },
          { label: t("photos"), href: "/administration/photos" },
          { label: t("students"), href: "/administration/photos/students" },
        ]}
      />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
          <PhotoStudentList />
        </Suspense>
      </ErrorBoundary>
      {/* <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-32" />
              ))}
            </div>
          }
        ></Suspense>
        <ImageGrid bucket={env.S3_AVATAR_BUCKET_NAME} prefix="student/" />
      </ErrorBoundary> */}
    </HydrateClient>
  );
}
