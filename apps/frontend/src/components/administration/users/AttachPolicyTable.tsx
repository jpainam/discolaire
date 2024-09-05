"use client";

import { SquarePlus } from "lucide-react";

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

export function AttachPolicyTable() {
  const { t } = useLocale();
  const policiesQuery = api.permission.policies.useQuery();
  const { fullDateFormatter } = useDateFormat();
  if (policiesQuery.isPending) {
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
          <TableHead></TableHead>
          <TableHead>
            {t("policy")} - {t("name")}
          </TableHead>
          <TableHead>{t("users")}</TableHead>
          <TableHead>{t("roles")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policiesQuery.data?.map((policy) => {
          return (
            <TableRow key={policy.id}>
              <TableCell>
                <SquarePlus className="h-4 w-4" />
              </TableCell>
              <TableCell>{policy.name}</TableCell>
              <TableCell>{policy.users}</TableCell>
              <TableCell>{policy.roles}</TableCell>
              <TableCell>
                {fullDateFormatter.format(policy.createdAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
