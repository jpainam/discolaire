"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { UserRoleCard } from "~/components/users/UserRoleCard";
import { useTRPC } from "~/trpc/react";

export function StaffRoleTable({
  staffId,
  userId,
}: {
  staffId: string;
  userId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: currentRoleIds } = useSuspenseQuery(
    trpc.staff.roles.queryOptions(staffId),
  );

  const handleSuccess = async () => {
    await queryClient.invalidateQueries(trpc.staff.roles.pathFilter());
    await queryClient.invalidateQueries(trpc.staff.permissions.pathFilter());
  };

  return (
    <UserRoleCard
      userId={userId}
      currentRoleIds={currentRoleIds}
      onSuccess={handleSuccess}
    />
  );
}
