"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { api } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export function ReportCardTable() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const params = useParams() as { id: string };
  const rowClassName = "border-b border-muted-200";
  const { data: students } = api.classroom.students.useQuery(params.id);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{t("fullName")}</TableHead>
          <TableHead>{t("avg")}</TableHead>
          <TableHead>{t("rank")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
