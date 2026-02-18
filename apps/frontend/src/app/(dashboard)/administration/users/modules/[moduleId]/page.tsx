import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { HydrateClient } from "~/trpc/server";
import { ModulePermissionTable } from "./ModulePermissionTable";

export default async function Page(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const params = await props.params;

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ModulePermissionTable moduleId={params.moduleId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
