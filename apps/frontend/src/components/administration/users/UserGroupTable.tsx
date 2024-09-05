"use client";

import { useLocale } from "@repo/i18n";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

export function UserGroupTable() {
  const { t } = useLocale();
  const usersRoleQuery = api.permission.roles.useQuery();
  const { fullDateFormatter } = useDateFormat();
  if (usersRoleQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>
            {t("roles")} - {t("name")}
          </TableHead>
          <TableHead>{t("users")}</TableHead>
          <TableHead>{t("attach_policy")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersRoleQuery.data?.map((role) => {
          return (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.users}</TableCell>
              <TableCell>Attach policy</TableCell>
              <TableCell>{fullDateFormatter.format(role.createdAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
