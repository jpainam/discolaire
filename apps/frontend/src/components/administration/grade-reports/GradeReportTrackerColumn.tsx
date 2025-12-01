import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { decode } from "entities";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Progress } from "@repo/ui/components/progress";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

export function useGradeTrackerColumns(): ColumnDef<
  RouterOutputs["gradeSheet"]["gradesReportTracker"][number],
  unknown
>[] {
  const t = useTranslations();
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
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "subject.course.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("subject")} />
        ),
        cell: ({ row }) => {
          const subject = row.original.subject;
          return (
            <span className="text-muted-foreground">{subject.course.name}</span>
          );
        },
      },
      {
        accessorKey: "subject.teacher.lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("teacher")} />
        ),
        cell: ({ row }) => {
          const subject = row.original.subject;
          return (
            <div className="text-muted-foreground flex items-center gap-2">
              <span>{decode(subject.teacher?.lastName ?? "")}</span>
              <span className="text-xs">({subject.classroom.name})</span>
            </div>
          );
        },
      },
      {
        accessorKey: "terms",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Progress")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const report = row.original;
          const completed = (report.terms.length * 100) / 6;
          return (
            <div className="flex items-center gap-2">
              <Progress value={completed} className="w-20" />
              <span className="text-muted-foreground text-xs">
                {Math.round(completed)}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "subject.classroom.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Completed")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const report = row.original;
          const completed = report.terms.length;
          return <Badge variant="secondary">{completed}/6</Badge>;
        },
      },
      {
        accessorKey: "remaining",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("Remaining")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const report = row.original;
          const completed = report.terms.length;
          const remaining = 6 - completed;
          return (
            <Badge variant={remaining === 0 ? "default" : "outline"}>
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
          const report = row.original;
          const completed = report.terms.length;
          //const remaining = 6 - completed;
          return (
            <>
              {completed === 6 ? (
                <Badge variant="outline" className="gap-1">
                  <CheckIcon
                    className="text-emerald-500"
                    size={12}
                    aria-hidden="true"
                  />
                  {t("Completed")}
                </Badge>
              ) : completed > 0 ? (
                <Badge variant="outline" className="gap-1.5">
                  <span
                    className="size-1.5 rounded-full bg-red-500"
                    aria-hidden="true"
                  ></span>
                  {t("In Progress")}
                </Badge>
              ) : (
                <Badge variant="outline">Not Started</Badge>
              )}
            </>
          );
        },
      },
    ],
    [t],
  );
}
