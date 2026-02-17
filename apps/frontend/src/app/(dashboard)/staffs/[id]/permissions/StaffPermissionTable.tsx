"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function StaffPermissionTable({
  staffId,
  userId,
}: {
  staffId: string;
  userId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<
    RouterOutputs["module"]["all"][number] | null
  >(null);
  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());
  const { data: staffPermissions } = useSuspenseQuery(
    trpc.staff.permissions.queryOptions(staffId),
  );
  const t = useTranslations();
  const { data: permissions } = useSuspenseQuery(
    trpc.permission.all.queryOptions(),
  );

  const updatePermission = useMutation(
    trpc.user.updatePermission.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.staff.permissions.pathFilter(),
        );
        toast.success("Permission mise à jour");
      },
      onError: () => {
        toast.error("Erreur lors de la mise à jour");
      },
    }),
  );

  const { moduleMapPermission, staffperms } = useMemo(() => {
    const mmp = new Map<string, RouterOutputs["permission"]["all"]>();
    const resourceToModuleId = new Map<string, string>();
    modules.forEach((mod) => {
      mmp.set(mod.id, []);
      mod.permissions.forEach((permission) => {
        resourceToModuleId.set(permission.resource, mod.id);
      });
    });
    permissions.forEach((permission) => {
      const moduleId = resourceToModuleId.get(permission.resource);
      if (!moduleId) return;
      const modulePermissions = mmp.get(moduleId);
      if (modulePermissions) {
        modulePermissions.push(permission);
      } else {
        mmp.set(moduleId, [permission]);
      }
    });
    const staffperms = new Map<
      string,
      RouterOutputs["staff"]["permissions"][number]
    >();
    staffPermissions.forEach((sps) => {
      staffperms.set(sps.resource, sps);
    });
    return { moduleMapPermission: mmp, staffperms };
  }, [modules, permissions, staffPermissions]);

  const perms = selectedModule
    ? moduleMapPermission?.get(selectedModule.id)
    : [];

  const handlePermissionChange = (
    permission: RouterOutputs["permission"]["all"][number],
    value: string,
  ) => {
    const [resource, action] = permission.resource.split(".");
    if (!resource || !action) return;
    updatePermission.mutate({
      userId,
      resource,
      action: action as "read" | "update" | "create" | "delete",
      effect: value as "allow" | "deny",
    });
  };

  return (
    <div className="grid grid-cols-[16rem_1fr] items-start gap-4">
      <div className="bg-muted/50 grid grid-cols-1 border">
        {modules.map((mod, index) => {
          return (
            <div
              onClick={() => {
                void setSelectedModule(mod);
              }}
              className={cn(
                "pointer flex flex-col gap-1 border-b px-4 py-2",
                selectedModule?.id == mod.id && "bg-primary/10",
              )}
              key={index}
            >
              <span className="font-medium">{mod.name}</span>
              <span className="text-muted-foreground">{mod.description}</span>
            </div>
          );
        })}
      </div>
      {selectedModule && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedModule.name}</CardTitle>
            <CardDescription>{selectedModule.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 pt-1">
            {perms?.map((p, idx) => {
              const staffperm = staffperms.get(p.resource);
              const effect = staffperm?.effect;
              const roleSources = staffperm?.sources.filter(
                (s) => s.type === "role",
              ) as
                | { type: "role"; role: { id: string; name: string } }[]
                | undefined;

              return (
                <div
                  key={`${p.resource}-${idx}`}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex flex-col gap-2 px-2">
                    <div className="text-xs">{p.name}</div>
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge
                        variant={
                          p.type === "ACTION"
                            ? "success"
                            : p.type === "MENU"
                              ? "primary"
                              : "destructive"
                        }
                        size="xs"
                        appearance="light"
                      >
                        {p.type}
                      </Badge>
                      <Badge size="xs" variant="info" appearance="light">
                        {p.resource}
                      </Badge>
                      {roleSources &&
                        roleSources.length > 0 &&
                        roleSources.map((rs) => (
                          <Badge
                            key={rs.role.id}
                            size="xs"
                            variant="warning"
                            appearance="light"
                          >
                            Via rôle: {rs.role.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div>
                    <Select
                      value={effect ?? ""}
                      onValueChange={(value) =>
                        handlePermissionChange(p, value)
                      }
                      disabled={updatePermission.isPending}
                    >
                      <SelectTrigger size="sm" className="w-[110px]">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">
                          <CheckIcon className="text-green-600" />
                          {t("Allow")}
                        </SelectItem>
                        <SelectItem value="deny">
                          <XIcon className="text-red-600" />
                          {t("Deny")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
