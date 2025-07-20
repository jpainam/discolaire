"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Skeleton } from "@repo/ui/components/skeleton";
import { Switch } from "@repo/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { menuPolicies, policies } from "~/configs/policies";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { NoPermission } from "../no-permission";

export function PermissionTable({ userId }: { userId: string }) {
  const { t } = useLocale();
  const canUpdatePermission = useCheckPermission(
    "policy",
    PermissionAction.UPDATE,
  );
  const trpc = useTRPC();
  const canReadPermission = useCheckPermission("policy", PermissionAction.READ);
  const permissionsQuery = useQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );

  const queryClient = useQueryClient();

  const permissionMutation = useMutation(
    trpc.user.updatePermission.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.user.getPermissions.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );

  const groups = _.groupBy(policies, "resource");
  const debounced = useDebouncedCallback(
    (
      resource: string,
      action: "Read" | "Update" | "Create" | "Delete",
      checked: boolean,
    ) => {
      permissionMutation.mutate({
        userId: userId,
        resource: resource,
        action: action,
        effect: checked ? "Allow" : "Deny",
      });
    },
    500,
  );

  if (!canReadPermission) {
    return <NoPermission className="py-8" />;
  }
  if (permissionsQuery.isPending) {
    return (
      <div className="grid w-full grid-cols-2 gap-4 p-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-8" />
        ))}
      </div>
    );
  }
  const permissions = permissionsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-transparent">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("read")}</TableHead>
              <TableHead>{t("edit")}</TableHead>
              <TableHead>{t("create")}</TableHead>
              <TableHead>{t("delete")}</TableHead>
              {/* <TableHead>{t("conditions")}</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(groups).map((key, index) => {
              const group = groups[key];
              if (!group) return null;
              const perm = group[0];
              if (!perm) return null;
              const canRead = !!permissions.find(
                (p) =>
                  p.resource === perm.resource &&
                  p.action === "Read" &&
                  p.effect === "Allow",
              );
              const canUpdate = permissions.find(
                (p) =>
                  p.resource === perm.resource &&
                  p.action === "Update" &&
                  p.effect === "Allow",
              );
              const canCreate = permissions.find(
                (p) =>
                  p.resource === perm.resource &&
                  p.action === "Create" &&
                  p.effect === "Allow",
              );
              const canDelete = permissions.find(
                (p) =>
                  p.resource === perm.resource &&
                  p.action === "Delete" &&
                  p.effect === "Allow",
              );
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{t(perm.title)}</TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={canRead ? true : false}
                      disabled={!canUpdatePermission}
                      onCheckedChange={(checked) => {
                        debounced(perm.resource, "Read", checked);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={canUpdate ? true : false}
                      //disabled={!canUpdatePermission}
                      onCheckedChange={(checked) => {
                        debounced(perm.resource, "Update", checked);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={canCreate ? true : false}
                      //disabled={!canUpdatePermission}
                      onCheckedChange={(checked) => {
                        debounced(perm.resource, "Create", checked);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={canDelete ? true : false}
                      //disabled={!canUpdatePermission}
                      onCheckedChange={(checked) => {
                        debounced(perm.resource, "Delete", checked);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-transparent">
              <TableHead>{t("menu")}</TableHead>
              <TableHead>{t("access")}?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuPolicies.map((menu, index) => {
              const canAccess = !!permissions.find(
                (p) =>
                  p.resource === menu.resource &&
                  p.action === "Read" &&
                  p.effect === "Allow",
              );
              return (
                <TableRow key={`menu-policy-${index}`}>
                  <TableCell className="font-medium">{t(menu.title)}</TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={canAccess ? true : false}
                      disabled={!canUpdatePermission}
                      onCheckedChange={(checked) => {
                        debounced(menu.resource, "Read", checked);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
