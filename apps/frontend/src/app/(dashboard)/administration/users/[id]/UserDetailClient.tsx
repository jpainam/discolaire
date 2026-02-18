"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AddPermissionSelector } from "~/components/administration/users/AddPermissionSelector";
import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
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

export function UserDetailClient({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const t = useTranslations();

  const removePermission = useMutation(
    trpc.user.removePermission.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.user.getPermissions.pathFilter(),
        );
        toast.success(t("updated_successfully"));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const { data: userPermissions } = useSuspenseQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );
  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());

  const currentPermissionResources = userPermissions
    .filter((p) => p.sources.some((s) => s.type === "direct"))
    .map((p) => p.resource);

  const handleAddPermission = () => {
    openModal({
      title: "Ajouter des permissions",
      className: "sm:max-w-xl",
      view: (
        <AddPermissionSelector
          userId={userId}
          currentPermissionResources={currentPermissionResources}
        />
      ),
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
    permissionsByModule.get(moduleKey)!.permissions.push(perm);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>
          Permissions effectives de l&apos;utilisateur (via rôles et directes)
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={handleAddPermission}>
            <PlusIcon />
            {t("add")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {userPermissions.length === 0 ? (
          <EmptyComponent
            title="Aucune permission"
            description="Cet utilisateur n'a aucune permission"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from(permissionsByModule.entries()).map(
              ([moduleId, { moduleName, permissions }]) => (
                <div key={moduleId} className="space-y-2">
                  <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {moduleName}
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {permissions.map((p) => {
                      const roleSources = p.sources.filter(
                        (s) => s.type === "role",
                      ) as {
                        type: "role";
                        role: { id: string; name: string };
                      }[];

                      const isDirect = p.sources.some(
                        (s) => s.type === "direct",
                      );
                      const isRoleOnly = !isDirect;

                      return (
                        <div
                          key={p.resource}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">{p.resource}</span>
                            <div className="flex flex-wrap items-center gap-1">
                              {p.effect === "allow" ? (
                                <Badge
                                  size="xs"
                                  variant="success"
                                  appearance="light"
                                >
                                  <CheckIcon className="size-3" />
                                  Allow
                                </Badge>
                              ) : (
                                <Badge
                                  size="xs"
                                  variant="destructive"
                                  appearance="light"
                                >
                                  <XIcon className="size-3" />
                                  Deny
                                </Badge>
                              )}
                              {roleSources.map((rs) => (
                                <Badge
                                  key={rs.role.id}
                                  size="xs"
                                  variant="warning"
                                  appearance="light"
                                >
                                  via {rs.role.name}
                                </Badge>
                              ))}
                              {isDirect && (
                                <Badge
                                  size="xs"
                                  variant="info"
                                  appearance="light"
                                >
                                  direct
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            //className="text-destructive"
                            disabled={isRoleOnly || removePermission.isPending}
                            onClick={() =>
                              removePermission.mutate({
                                userId,
                                resource: p.resource,
                              })
                            }
                          >
                            <XIcon className="text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
