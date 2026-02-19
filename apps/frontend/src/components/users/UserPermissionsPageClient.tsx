"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTRPC } from "~/trpc/react";
import { UserPermissionTable } from "./UserPermissionTable";
import { UserRoleCard } from "./UserRoleCard";

function UserRoleCardWrapper({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => Promise<void> | void;
}) {
  const trpc = useTRPC();
  const { data: userPermissions } = useSuspenseQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );

  const currentRoleIds = [
    ...new Set(
      userPermissions
        .flatMap((p) => p.sources)
        .filter((s) => s.type === "role")
        .map((s) => (s as { type: "role"; role: { id: string } }).role.id),
    ),
  ];

  return (
    <UserRoleCard
      userId={userId}
      currentRoleIds={currentRoleIds}
      onSuccess={onSuccess}
    />
  );
}

export function UserPermissionsPageClient({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleSuccess = async () => {
    await queryClient.invalidateQueries(trpc.user.getPermissions.pathFilter());
  };

  return (
    <Tabs defaultValue="permissions" className="px-4">
      <TabsList>
        <TabsTrigger value="permissions">Permission</TabsTrigger>
        <TabsTrigger value="roles">Role</TabsTrigger>
      </TabsList>
      <TabsContent value="permissions">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
            <UserPermissionTable userId={userId} onSuccess={handleSuccess} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      <TabsContent value="roles">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<TableSkeleton rows={8} cols={2} />}>
            <UserRoleCardWrapper userId={userId} onSuccess={handleSuccess} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
