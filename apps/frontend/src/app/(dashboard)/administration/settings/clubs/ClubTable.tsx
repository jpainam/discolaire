"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { ClubTableAction } from "./ClubTableAction";

export function ClubTable() {
  const clubsQuery = api.setting.clubs.useQuery();
  const clubs = clubsQuery.data ?? [];
  const { t } = useLocale();
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>{t("name")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clubs.length === 0 && (
          <TableRow>
            <TableCell colSpan={2}>
              <EmptyState />
            </TableCell>
          </TableRow>
        )}
        {clubs.map((club) => {
          return (
            <TableRow key={club.id}>
              <TableCell className="py-0">{club.name}</TableCell>
              <TableCell className="py-0 text-right">
                <ClubTableAction name={club.name} id={club.id} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
