"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { UserRoleCard } from "~/components/users/UserRoleCard";
import { useTRPC } from "~/trpc/react";

export function UserDetailRole({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  const handleSuccess = async () => {
    await queryClient.invalidateQueries(trpc.user.getPermissions.pathFilter());
  };

  return (
    <UserRoleCard
      userId={userId}
      currentRoleIds={currentRoleIds}
      onSuccess={handleSuccess}
    />
  );
}
