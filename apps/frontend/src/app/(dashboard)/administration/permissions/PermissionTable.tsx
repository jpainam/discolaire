"use client";
import { Checkbox } from "@repo/ui/components/checkbox";
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

export function PermissionTable() {
  const { t } = useLocale();

  const permissionQuery = api.permission.all.useQuery();

  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("show")}</TableHead>
            <TableHead>{t("create")}</TableHead>
            <TableHead>{t("edit")}</TableHead>
            <TableHead>{t("delete")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionQuery.isPending && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )}

          {permissionQuery.data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Checkbox />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
