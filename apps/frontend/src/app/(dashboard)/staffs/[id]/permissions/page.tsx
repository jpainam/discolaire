import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { StaffPermissionTable } from "./StaffPermissionTable";
import { StaffRoleTable } from "./StaffRoleTable";

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
      <Tabs defaultValue="permissions" className="px-4">
        <TabsList>
          <TabsTrigger value="permissions">Permission</TabsTrigger>
          <TabsTrigger value="roles">Role</TabsTrigger>
        </TabsList>
        <TabsContent value="permissions">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
              <StaffPermissionTable staffId={staffId} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="roles">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
              <StaffRoleTable staffId={staffId} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
