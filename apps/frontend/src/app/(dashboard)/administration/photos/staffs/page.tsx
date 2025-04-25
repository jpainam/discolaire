import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { env } from "~/env";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { ImageGrid } from "../ImageGrid";

export default function Page() {
  prefetch(
    trpc.photo.listObjects.queryOptions({
      prefix: "staff/",
      bucket: env.S3_AVATAR_BUCKET_NAME,
    }),
  );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-32" />
              ))}
            </div>
          }
        ></Suspense>
        <ImageGrid bucket={env.S3_AVATAR_BUCKET_NAME} prefix="staff/" />
      </ErrorBoundary>
    </HydrateClient>
  );
}
