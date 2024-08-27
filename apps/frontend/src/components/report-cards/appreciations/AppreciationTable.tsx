"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableSkeleton } from "@repo/ui/data-table/v2/data-table-skeleton";
import FlatBadge from "@repo/ui/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { ReportCardType } from "~/types/report-card";
import { getFullName } from "../../../utils/full-name";
import { AppreciationCategoryList } from "./AppreciationCategoryList";
import { EditableAppreciation } from "./EditableAppreciation";

export function AppreciationTable({ reports }: { reports: any[] }) {
  const { createQueryString } = useCreateQueryString();
  const [selected, setSelected] = useState<string[]>([]);
  const appreciationCategoriesQuery = api.appreciation.categories.useQuery();

  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");
  const queryClient = useQueryClient();

  const [remarksMap, setRemarkMaps] = useState<Record<string, ReportCardType>>(
    {},
  );
  const termId = Number(searchParams.get("term"));
  const remarksQuery = api.reportCard.getRemarks.useQuery({
    classroomId: classroomId || "",
    termId: termId || 0,
  });

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
    throw appreciationCategoriesQuery.error || remarksQuery.error;
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
                    routes.report_cards.appreciations +
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
                      (remarksMap[report.student.id]?.remark) ||
                      t("double_clicked_to_edit_or_add_remarks")
                    }
                  />
                  <div className="ml-auto opacity-0 group-hover/report:opacity-100">
                    {appreciationCategoriesQuery.isPending ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      appreciationCategoriesQuery.data && (
                        <AppreciationCategoryList
                          studentId={report.student.id}
                          categories={appreciationCategoriesQuery.data}
                        />
                      )
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
