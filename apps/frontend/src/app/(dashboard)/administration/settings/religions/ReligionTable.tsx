"use client";

import { useLocale } from "@repo/i18n";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/react";
import { ReligionTableAction } from "./ReligionTableAction";

export function ReligionTable() {
  const { t, i18n } = useLocale();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const religionsQuery = api.religion.all.useQuery();
  const religions = religionsQuery.data ?? [];
  return (
    <div className="mx-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead>{t("created_by")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {religions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {religions.map((denom) => {
            return (
              <TableRow key={denom.id}>
                <TableCell className="py-0">{denom.name}</TableCell>

                <TableCell className="py-0">
                  {dateFormatter.format(new Date(denom.createdAt))}
                </TableCell>
                <TableCell className="py-0">{denom.createdBy.name}</TableCell>
                <TableCell className="py-0 text-right">
                  <ReligionTableAction name={denom.name} id={denom.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
