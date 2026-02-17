"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Badge } from "~/components/base-badge";
import { useTRPC } from "~/trpc/react";

export function StaffPermissionSummary({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: staffPermissions } = useSuspenseQuery(
    trpc.staff.permissions.queryOptions(staffId),
  );
  const { data: staffRoleIds } = useSuspenseQuery(
    trpc.staff.roles.queryOptions(staffId),
  );

  const allowCount = staffPermissions.filter((p) => p.effect === "allow").length;
  const denyCount = staffPermissions.filter((p) => p.effect === "deny").length;
  const roleCount = staffRoleIds.length;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="success" appearance="light" size="sm">
        {allowCount} autorisée{allowCount > 1 ? "s" : ""}
      </Badge>
      <Badge variant="destructive" appearance="light" size="sm">
        {denyCount} refusée{denyCount > 1 ? "s" : ""}
      </Badge>
      <Badge variant="info" appearance="light" size="sm">
        {roleCount} rôle{roleCount > 1 ? "s" : ""}
      </Badge>
    </div>
  );
}
