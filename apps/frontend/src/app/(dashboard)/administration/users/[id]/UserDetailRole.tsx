"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddRoleSelector } from "~/components/administration/users/AddRoleSelector";
import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function UserDetailRole({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const { openModal } = useModal();
  const t = useTranslations();

  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  const { data: userPermissions } = useSuspenseQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );
  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());

  const userRoleIds = new Set(
    userPermissions
      .flatMap((p) => p.sources)
      .filter((s) => s.type === "role")
      .map((s) => (s as { type: "role"; role: { id: string } }).role.id),
  );

  const userRoles = roles.filter((r) => userRoleIds.has(r.id));

  const currentRoleIds = userRoles.map((r) => r.id);

  const handleAddRole = () => {
    openModal({
      title: t("roles"),
      className: "sm:max-w-xl",
      view: <AddRoleSelector userId={userId} currentRoleIds={currentRoleIds} />,
    });
  };

  // Group permissions by module
  const permissionsByModule = new Map<
    string,
    { moduleName: string; permissions: typeof userPermissions }
  >();

  for (const perm of userPermissions) {
    const mod = modules.find((m) =>
      m.permissions.some((mp) => mp.resource === perm.resource),
    );
    const moduleKey = mod?.id ?? "other";
    const moduleName = mod?.name ?? "Autres";
    if (!permissionsByModule.has(moduleKey)) {
      permissionsByModule.set(moduleKey, { moduleName, permissions: [] });
    }
    permissionsByModule.get(moduleKey)?.permissions.push(perm);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <CardDescription>Rôles attribués à cet utilisateur</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={handleAddRole}>
            <PlusIcon />
            {t("add")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {userRoles.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun rôle attribué</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userRoles.map((r) => (
              <Badge key={r.id} variant="primary" appearance="light">
                {r.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
