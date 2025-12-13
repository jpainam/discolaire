import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { decode } from "entities";
import { CheckIcon, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";
import { useSheet } from "~/hooks/use-sheet";
import { cn } from "~/lib/utils";
import { getFullName } from "~/utils";
import { GradeReportTrackerDetails } from "./GradeReportTrackerDetails";

export function useGradeTrackerColumns(): ColumnDef<
  RouterOutputs["gradeSheet"]["gradesReportTracker"][number],
  unknown
>[] {
  const t = useTranslations();
  const [termId] = useQueryState("termId");
  const [count] = useQueryState("count", parseAsInteger);
  const { openSheet } = useSheet();
  return useMemo(
    () => [
      {
        id: "select",
        accessorKey: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 18,
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "course.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("subject")} />
        ),
        cell: ({ row }) => {
          const subject = row.original;
          return (
            <div className="flex flex-1 flex-row items-center gap-1">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: subject.course.color,
                }}
              />
              <Link
                href={`/classrooms/${subject.classroomId}/subjects/${subject.id}`}
                className="text-muted-foreground hover:underline"
              >
                {subject.course.name}
              </Link>
              <Button
                onClick={() => {
                  openSheet({
                    title: `${subject.course.reportName}`,
                    description: `${subject.teacher?.prefix} ${getFullName(subject.teacher)}`,
                    className: "min-w-1/2 w-full sm:max-w-5xl w-3/4",
                    //   className: "min-w-1/2 w-full sm:max-w-5xl w-1/2",
                    view: (
                      <GradeReportTrackerDetails
                        subjectId={subject.id}
                        classroomId={subject.classroomId}
                      />
                    ),
                  });
                }}
                variant={"secondary"}
                size={"sm"}
                className="h-7"
              >
                {t("details")} <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "teacher.lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("teacher")} />
        ),
        cell: ({ row }) => {
          const subject = row.original;
          return (
            <Link
              href={`/staffs/${subject.teacherId}`}
              className="text-muted-foreground hover:underline"
            >
              {decode(
                subject.teacher?.lastName ??
                  subject.teacher?.firstName ??
                  "N/A",
              )}
            </Link>
          );
        },
      },
      {
        accessorKey: "classroom.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("classroom")} />
        ),
        cell: ({ row }) => {
          const subject = row.original;

          return (
            <Link
              href={`/classrooms/${subject.classroomId}`}
              className="text-muted-foreground hover:underline"
            >
              ({subject.classroom.name})
            </Link>
          );
        },
      },
      {
        accessorKey: "gradeSheets",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Progress")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const gradesheets = row.original.gradeSheets;
          let report = gradesheets.map((g) => g.termId);
          if (termId) {
            report = report.filter((r) => r == termId);
          }
          const completed = (report.length * 100) / (count ?? 6);
          return (
            <div className="flex items-center gap-2">
              <Progress
                value={completed}
                className={cn(
                  "w-20",
                  completed < 100
                    ? "[&>div]:bg-red-600"
                    : "[&>div]:bg-green-600",
                )}
              />
              <span className="text-muted-foreground text-xs">
                {Math.round(completed)}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "classroom",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={""} />
        ),
        size: 60,
        cell: ({ row }) => {
          const gradesheets = row.original.gradeSheets;
          let report = gradesheets.map((g) => g.termId);
          if (termId) {
            report = report.filter((r) => r == termId);
          }
          const len = report.length;
          return (
            <Badge
              variant={
                len == count
                  ? "success"
                  : len > (count ?? len)
                    ? "destructive"
                    : "secondary"
              }
              appearance={"outline"}
              className="border-border"
            >
              {report.length}/{count ?? 6}
            </Badge>
          );
        },
      },
      {
        accessorKey: "remaining",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Remaining")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const gradesheets = row.original.gradeSheets;
          let report = gradesheets.map((g) => g.termId);
          if (termId) {
            report = report.filter((r) => r == termId);
          }
          const completed = report.length;
          const remaining = (count ?? 6) - completed;
          return (
            <Badge
              variant={remaining === 0 ? "success" : "destructive"}
              appearance={"outline"}
            >
              {remaining}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Status")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const gradesheets = row.original.gradeSheets;
          let report = gradesheets.map((g) => g.termId);
          if (termId) {
            report = report.filter((r) => r == termId);
          }
          const completed = report.length;
          const remaining = (count ?? 6) - completed;
          return (
            <>
              {remaining == 0 ? (
                <Badge
                  variant="success"
                  appearance={"outline"}
                  className="gap-1"
                >
                  <CheckIcon
                    className="text-emerald-500"
                    size={12}
                    aria-hidden="true"
                  />
                  {t("Completed")}
                </Badge>
              ) : (
                <Badge
                  variant="warning"
                  appearance={"outline"}
                  className="gap-1.5"
                >
                  <span
                    className="size-1.5 rounded-full bg-red-500"
                    aria-hidden="true"
                  ></span>
                  {t("In Progress")}
                </Badge>
              )}
            </>
          );
        },
      },
    ],
    [t, termId, count, openSheet],
  );
}
