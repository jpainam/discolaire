/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api, useTRPC } from "~/trpc/react";
import type { ReportCardType } from "~/types/report-card";
import { getFullName } from "~/utils";
import { AppreciationCategoryList } from "./AppreciationCategoryList";
import { EditableAppreciation } from "./EditableAppreciation";

export function AppreciationTable({ reports }: { reports: any[] }) {
  const { createQueryString } = useCreateQueryString();
  const [selected, setSelected] = useState<string[]>([]);
  const trpc = useTRPC();
  const appreciationCategoriesQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );

  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");

  const [remarksMap, setRemarkMaps] = useState<Record<string, ReportCardType>>(
    {},
  );
  const termId = Number(searchParams.get("term"));
  const remarksQuery = useQuery(
    trpc.reportCard.getRemarks.queryOptions({
      classroomId: classroomId ?? "",
      termId: termId || 0,
    }),
  );

  useEffect(() => {
    if (remarksQuery.data) {
      const map: Record<string, ReportCardType> = {};
      remarksQuery.data.forEach((remark) => {
        map[remark.studentId] = remark;
      });
      setRemarkMaps(map);
    }
  }, [remarksQuery.data]);

  const upsertStudentRemarkMutation = api.reportCard.upsertRemark.useMutation();

  const rowClassName = "py-0";

  const { t } = useLocale();
  if (appreciationCategoriesQuery.isPending || remarksQuery.isPending) {
    return (
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        rowCount={18}
        columnCount={6}
      />
    );
  }
  if (appreciationCategoriesQuery.isError || remarksQuery.isError) {
    showErrorToast(appreciationCategoriesQuery.error ?? remarksQuery.error);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead>👨‍🏫 {t("fullName")}</TableHead>
          <TableHead>📊 {t("avg")}</TableHead>
          <TableHead>📈 {t("rank")}</TableHead>
          <TableHead>📓 {t("N.Notes")}</TableHead>
          <TableHead>📮 {t("T.Abs")}</TableHead>
          <TableHead>🏮 {t("T.Late")}</TableHead>
          <TableHead>🗂️ {t("overall_opinion")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report, index) => {
          return (
            <TableRow
              className={cn(
                rowClassName,
                "group/report",
                selected.includes(report.student.id) &&
                  "bg-secondary text-secondary-foreground",
              )}
              key={report.student.id}
            >
              <TableCell className={cn(rowClassName)}>
                <Checkbox
                  name={`reports`}
                  value={report.student.id}
                  checked={selected.includes(report.student.id)}
                  onCheckedChange={(val) => {
                    if (val) {
                      setSelected([...selected, report.student.id]);
                    } else {
                      setSelected(
                        selected.filter((id) => id !== report.student.id),
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell className={cn(rowClassName)}>{index + 1}</TableCell>
              <TableCell className={cn(rowClassName)}>
                <AvatarState avatar={report.student?.avatar} pos={index} />
              </TableCell>

              <TableCell className={cn(rowClassName)}>
                <Link
                  className="flex flex-col gap-0 hover:text-blue-500 hover:underline"
                  href={
                    routes.reportcards.appreciations +
                    "/?" +
                    createQueryString({ student: report.student.id })
                  }
                >
                  <span className="font-medium">
                    {getFullName(report.student)}
                  </span>
                  <span className="text-sm italic">
                    {report.student?.registrationNumber}
                  </span>
                </Link>
              </TableCell>
              <TableCell className={cn(rowClassName)}>
                <FlatBadge variant={report.average < 10 ? "red" : "green"}>
                  {report.average.toFixed(2)}
                </FlatBadge>
              </TableCell>
              <TableCell className={cn(rowClassName)}>{report.rank}</TableCell>
              <TableCell className={cn(rowClassName)}>
                {report.absences}
              </TableCell>
              <TableCell className={cn(rowClassName)}>{report.lates}</TableCell>
              <TableCell className={cn(rowClassName)}>{report.lates}</TableCell>
              <TableCell>
                <div className="flex flex-row items-center justify-between gap-1">
                  <EditableAppreciation
                    className={"w-full"}
                    onSubmit={(text) => {
                      if (!classroomId || !termId) return;
                      upsertStudentRemarkMutation.mutate({
                        studentId: report.student.id,
                        classroomId: classroomId,
                        termId: termId,
                        remark: text,
                      });
                    }}
                    initialText={
                      remarksMap[report.student.id]?.remark ??
                      t("double_clicked_to_edit_or_add_remarks")
                    }
                  />
                  <div className="ml-auto opacity-0 group-hover/report:opacity-100">
                    {appreciationCategoriesQuery.data && (
                      <AppreciationCategoryList
                        studentId={report.student.id}
                        categories={appreciationCategoriesQuery.data}
                      />
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
