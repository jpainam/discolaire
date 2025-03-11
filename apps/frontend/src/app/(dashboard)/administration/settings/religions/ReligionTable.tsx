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
import { ReligionTableAction } from "./ReligionTableAction";

export function ReligionTable() {
  const { t } = useLocale();

  const religionsQuery = api.religion.all.useQuery();
  const religions = religionsQuery.data ?? [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          {/* <TableHead>{t("createdAt")}</TableHead>
          <TableHead>{t("created_by")}</TableHead> */}
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {religions.length === 0 && (
          <TableRow>
            <TableCell colSpan={2}>
              <EmptyState />
            </TableCell>
          </TableRow>
        )}
        {religions.map((denom) => {
          return (
            <TableRow key={denom.id}>
              <TableCell className="py-0">{denom.name}</TableCell>

              {/* <TableCell className="py-0">
                {dateFormatter.format(new Date(denom.createdAt))}
              </TableCell> */}
              {/* <TableCell className="py-0">{denom.createdBy.name}</TableCell> */}
              <TableCell className="py-0 text-right">
                <ReligionTableAction name={denom.name} id={denom.id} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
