"use client";

import { useState } from "react";
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
import { EmptyComponent } from "~/components/EmptyComponent";
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
import { Label } from "../ui/label";

interface UserPermissionTableProps {
  userId: string;
  onSuccess?: () => Promise<void> | void;
}

export function UserPermissionTable({
  userId,
  onSuccess,
}: UserPermissionTableProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const [selectedModule, setSelectedModule] = useState<
    RouterOutputs["module"]["all"][number] | null
  >(null);

  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());
  const { data: userPermissions } = useSuspenseQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );
  const { data: permissions } = useSuspenseQuery(
    trpc.permission.all.queryOptions(),
  );

  const updatePermission = useMutation(
    trpc.user.updatePermission.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.user.getPermissions.pathFilter(),
        );
        await onSuccess?.();
        toast.success("Permission mise à jour");
      },
      onError: () => {
        toast.error("Erreur lors de la mise à jour");
      },
    }),
  );

  // Build a lookup map: resource (lowercase) -> user permission
  const permMap = new Map(
    userPermissions.map((p) => [p.resource.toLowerCase(), p]),
  );

  // Build a set of resources belonging to the selected module
  const moduleResources = new Set(
    selectedModule?.permissions.map((p) => p.resource),
  );

  // Filter all permissions to only those in the selected module
  const modulePermissions = selectedModule
    ? permissions.filter((p) => moduleResources.has(p.resource))
    : [];

  const handlePermissionChange = (
    permission: RouterOutputs["permission"]["all"][number],
    value: string,
  ) => {
    updatePermission.mutate({
      userId,
      resource: permission.resource,
      effect: value as "allow" | "deny",
    });
  };

  return (
    <div className="grid grid-cols-[16rem_1fr] items-start gap-4">
      <div className="bg-muted/10 grid grid-cols-1 border">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(mod)}
            className={cn(
              "flex cursor-pointer flex-col gap-1 border-b px-4 py-2",
              selectedModule?.id === mod.id && "bg-muted",
            )}
          >
            <Label>{mod.name}</Label>
            <span className="text-muted-foreground">{mod.description}</span>
          </div>
        ))}
      </div>
      {selectedModule ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedModule.name}</CardTitle>
            <CardDescription>{selectedModule.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 pt-1">
            {modulePermissions.map((p) => {
              const perm = permMap.get(p.resource.toLowerCase());
              const effect = perm?.effect;
              const roleSources = perm?.sources.filter(
                (s) => s.type === "role",
              ) as
                | { type: "role"; role: { id: string; name: string } }[]
                | undefined;

              return (
                <div
                  key={p.resource}
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
                  <Select
                    value={effect ?? ""}
                    onValueChange={(value) => handlePermissionChange(p, value)}
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
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <EmptyComponent
          title="Choisir un module"
          description="Veuillez choisir un module à gauche pour commencer"
        />
      )}
    </div>
  );
}
