"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Checkbox } from "@repo/ui/components/checkbox";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useLocale } from "~/i18n";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useTRPC } from "~/trpc/react";

export function UserRoleTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const rolesQuery = useQuery(trpc.role.all.queryOptions());

  const params = useParams<{ id: string }>();

  const userRolesQuery = useQuery(
    trpc.user.roles.queryOptions({ userId: params.id }),
  );

  const attachRoleMutation = useMutation(
    trpc.role.attach.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.roles.pathFilter());
        await queryClient.invalidateQueries(trpc.role.all.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
      },

      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const remoteRoleMutation = useMutation(
    trpc.role.removeRole.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.roles.pathFilter());
        await queryClient.invalidateQueries(trpc.role.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const debounced = useDebouncedCallback((value: string, checked: boolean) => {
    if (checked) {
      attachRoleMutation.mutate({ roleId: value, userId: params.id });
    } else {
      remoteRoleMutation.mutate({ roleId: value, userId: params.id });
    }
  }, 1000);

  if (rolesQuery.isPending || userRolesQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  if (rolesQuery.error || userRolesQuery.error) {
    toast.error(rolesQuery.error?.message ?? userRolesQuery.error?.message);
    return;
  }
  const userRoleIds = userRolesQuery.data.map((role) => role.roleId);
  return (
    <ScrollArea className="m-2 min-h-[calc(100vh-20rem)] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>
              {t("roles")} - {t("name")}
            </TableHead>
            <TableHead>{t("users")}</TableHead>
            <TableHead>{t("attach_policy")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rolesQuery.data.map((role) => {
            return (
              <TableRow key={role.id}>
                <TableCell>
                  <Checkbox
                    checked={userRoleIds.includes(role.id)}
                    onCheckedChange={(checked: boolean) => {
                      toast.loading(t("updating"), { id: 0 });
                      debounced(role.id, checked);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/administration/users/roles/${role.id}`}
                    className="flex flex-row items-center gap-1 hover:text-blue-600 hover:underline"
                  >
                    <span>{role.name}</span>
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Link>
                </TableCell>
                <TableCell>{role.users}</TableCell>
                <TableCell>Attach policy</TableCell>
                <TableCell>
                  {role.createdAt.toLocaleDateString(i18next.language, {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
