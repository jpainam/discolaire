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
import { SportTableAction } from "./SportTableAction";

export function SportTable() {
  const sportsQuery = api.setting.sports.useQuery();
  const sports = sportsQuery.data ?? [];
  const { t } = useLocale();
  return (
    <div className="mx-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sports.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {sports.map((sport) => {
            return (
              <TableRow key={sport.id}>
                <TableCell className="py-0">{sport.name}</TableCell>
                <TableCell className="py-0 text-right">
                  <SportTableAction name={sport.name} id={sport.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
