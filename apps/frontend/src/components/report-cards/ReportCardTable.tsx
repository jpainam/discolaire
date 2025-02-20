"use client";

import Link from "next/link";

import type { FlatBadgeVariant } from "@repo/ui/components/FlatBadge";
import { useLocale } from "@repo/i18n";
import FlatBadge from "@repo/ui/components/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { ReportCardSummary } from "./ReportCardSummary";

interface ReportCardTableProps {
  reportCard: {
    subject: {
      name: string;
      teacher: string;
      teacherId: string;
    };
    max: number;
    min: number;
    avg: number;
  }[];
}
export function ReportCardTable({ reportCard }: ReportCardTableProps) {
  const { t } = useLocale();
  const rowClassName = "border text-center py-0 text-sm";
  console.log(reportCard);
  return (
    <div className="">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("subjects")}
            </TableHead>
            <TableHead className={cn(rowClassName)} colSpan={3}>
              {t("averages")}
            </TableHead>
            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("element_of_the_program_worked_during_the_period")}
            </TableHead>

            <TableHead rowSpan={2} className={cn(rowClassName)}>
              {t("general_appreciation_of_the_classroom")}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className={cn(rowClassName)}>{t("classroom")}</TableHead>
            <TableHead className={cn(rowClassName)}>{t("min")}</TableHead>
            <TableHead className={cn(rowClassName)}>{t("max")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportCard.map((card, index) => (
            <TableRow key={index}>
              <TableCell className={cn(rowClassName, "text-left")}>
                <div className="flex flex-col gap-0">
                  <span>{card.subject.name}</span>
                  <Link
                    className="ml-4 hover:text-blue-500 hover:underline"
                    href={routes.staffs.details(card.subject.teacherId || "")}
                  >
                    {card.subject.teacher}
                  </Link>
                </div>
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                <Cell n={card.avg} />
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                <Cell n={card.max} />
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                <Cell n={card.min} />
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                Consulter cahier de texte
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                Bon travail dans l'ensemble
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ReportCardSummary />
    </div>
  );
}

function Cell({ n }: { n?: number | null }) {
  let v: FlatBadgeVariant = "green";
  if (!n) {
    return <></>;
  }
  if (n < 10) {
    v = "red";
  } else if (n < 12) {
    v = "yellow";
  } else if (n < 14) {
    v = "blue";
  }
  return <FlatBadge variant={v}>{n.toFixed(2)}</FlatBadge>;
}
