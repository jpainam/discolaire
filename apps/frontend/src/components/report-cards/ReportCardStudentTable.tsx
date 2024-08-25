"use client";

import { useLocale } from "@repo/i18n";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { cn } from "~/lib/utils";
import { ReportCardStudentSummary } from "./ReportCardStudentSummary";

export function ReportCardStudentTable() {
  const { t } = useLocale();
  const rowClassName = "border text-center";
  return (
    <div className="">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("subjects")}
            </TableHead>
            <TableHead className={cn(rowClassName)} colSpan={2}>
              {t("averages")}
            </TableHead>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("element_of_the_program_worked_during_the_period")}
            </TableHead>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("app.a") + ":" + t("work")}
            </TableHead>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("app.b") + ":" + t("overall_opinion")}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className={cn(rowClassName)}>{t("student")}</TableHead>
            <TableHead className={cn(rowClassName)}>{t("classroom")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
      <ReportCardStudentSummary />
    </div>
  );
}
