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

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

export function UserRoleTable() {
  const { t } = useLocale();
  const rolesQuery = api.role.all.useQuery();
  const { fullDateFormatter } = useDateFormat();
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const userRolesQuery = api.user.roles.useQuery({ userId: params.id });

  const attachRoleMutation = api.role.attach.useMutation({
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
    },
    onSettled: async () => {
      await utils.user.roles.invalidate();
      await utils.role.all.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const remoteRoleMutation = api.role.removeRole.useMutation({
    onSettled: async () => {
      await utils.user.roles.invalidate();
      await utils.role.all.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
                      toast.loading("updating", { id: 0 });
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
                  {fullDateFormatter.format(role.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
