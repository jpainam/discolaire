"use client";

import { useQueryClient } from "@tanstack/react-query";

import { UserPermissionTable } from "~/components/users/UserPermissionTable";
import { useTRPC } from "~/trpc/react";

export function UserDetailClient({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleSuccess = async () => {
    await queryClient.invalidateQueries(trpc.user.getPermissions.pathFilter());
  };

  return <UserPermissionTable userId={userId} onSuccess={handleSuccess} />;
}
