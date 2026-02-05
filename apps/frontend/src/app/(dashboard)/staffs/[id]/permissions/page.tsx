import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { StaffPermissionTable } from "./StaffPermissionTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const staffId = params.id;
  const queryClient = getQueryClient();
  const staff = await queryClient.fetchQuery(
    trpc.staff.get.queryOptions(staffId),
  );
  if (!staff.userId) {
    return (
      <EmptyComponent
        title={"Aucun utilisateur attaché"}
        description="Commencer par créer un utilisateur pour ce staff"
      />
    );
  }

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
          <StaffPermissionTable staffId={staffId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
