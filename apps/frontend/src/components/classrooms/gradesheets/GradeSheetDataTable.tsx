"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import { cn } from "@repo/ui/lib/utils";

import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { GradeSheetDataTableActions } from "./GradeSheetDataTableActions";
import { ActionCells } from "./GradeSheetDataTableColumns";
import { GradeSheetSummary } from "./GradeSheetSummary";

export function GradeSheetDataTable() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.classroom.gradesheets.queryOptions(params.id),
  );

  const [termId] = useQueryState("term");
  const [subjectId] = useQueryState("subject", parseAsInteger);

  const filteredGradesheets = useMemo(() => {
    let result = gradesheets;

    if (subjectId && isFinite(subjectId)) {
      result = result.filter((g) => g.subjectId == subjectId);
    }
    if (termId) {
      result = result.filter((g) => g.termId == termId);
    }
    return result;
  }, [gradesheets, subjectId, termId]);

  const t = useTranslations();
  const locale = useLocale();
  const { openSheet } = useSheet();
  function fetchGradeSheetColumns(): ColumnDef<
    RouterOutputs["classroom"]["gradesheets"][number],
    unknown
  >[] {
    return [
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
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("date")} />
        ),
        size: 80,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const createdAt = row.original.createdAt;

          return (
            <span className="text-muted-foreground">
              {createdAt.toLocaleDateString(locale, {
                month: "short",
                day: "2-digit",
                year: "2-digit",
              })}
            </span>
          );
        },
      },

      {
        accessorKey: "subject.course.reportName",
        size: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("subject")} />
        ),
        cell: ({ row }) => {
          const subject = row.original.subject;
          const teacher = subject.teacher;
          return (
            <div className="flex flex-row items-center gap-2">
              <span className="text-muted-foreground">
                {subject.course.reportName}
              </span>
              <Button
                onClick={() => {
                  openSheet({
                    title: `${subject.course.reportName} - ${row.original.name} - ${row.original.term.name}`,
                    description: `${teacher?.prefix} ${getFullName(teacher)}`,
                    className: "min-w-1/2 w-full sm:max-w-5xl w-1/2",
                    view: <GradeSheetSummary gradeSheetId={row.original.id} />,
                  });
                }}
                variant={"secondary"}
                size={"sm"}
                className="h-7"
              >
                Details <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "subject.teacher.lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("teacher")} />
        ),
        cell: ({ row }) => {
          const teacher = row.original.subject.teacher;
          return (
            <Link
              className="hover:text-blue-500 hover:underline"
              href={teacher?.id ? routes.staffs.details(teacher.id) : "#"}
            >
              {decode(teacher?.lastName ?? "")}
            </Link>
          );
        },
      },
      {
        accessorKey: "subject.coefficient",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("coeff")} />
        ),
        size: 50,
        cell: ({ row }) => {
          const subject = row.original.subject;
          return (
            <div className="text-muted-foreground">{subject.coefficient}</div>
          );
        },
      },
      {
        accessorKey: "num_grades",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("graded")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const numGrades = row.original.num_grades || 0;
          return <div className="text-muted-foreground">{numGrades}</div>;
        },
      },
      {
        accessorKey: "num_is_absent",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("absent")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const numIsAbsent = row.original.num_is_absent || 0;
          return (
            <div className={cn(numIsAbsent == 0 ? "" : "text-destructive")}>
              {numIsAbsent}
            </div>
          );
        },
      },
      {
        accessorKey: "avg",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("avg")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const avg = row.original.avg || 0;
          return (
            <FlatBadge variant={avg < 10 ? "red" : "green"}>
              {avg.toFixed(2)}
            </FlatBadge>
          );
        },
      },
      {
        accessorKey: "min",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("min")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const min = isFinite(row.original.min) ? row.original.min : 0;
          return (
            <FlatBadge variant={min < 10 ? "purple" : "yellow"}>
              {min.toFixed(2)}
            </FlatBadge>
          );
        },
      },
      {
        accessorKey: "max",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("max")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const max = isFinite(row.original.max) ? row.original.max : 0;
          return (
            <FlatBadge variant={max < 10 ? "pink" : "blue"}>
              {max.toFixed(2)}
            </FlatBadge>
          );
        },
      },
      {
        accessorKey: "weight",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("weight")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const weight = row.original.weight;
          return <div>{(weight || 0) * 100} %</div>;
        },
      },
      {
        accessorKey: "term",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("term")} />
        ),
        cell: ({ row }) => {
          const term = row.original.term;
          return <div>{term.name}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <ActionCells classroomId={params.id} gradesheet={row.original} />
        ),
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ];
  }

  const columns = fetchGradeSheetColumns();

  const { table } = useDataTable({
    columns: columns,
    data: filteredGradesheets,
  });
  return (
    <div className="w-full p-4">
      <DataTable table={table}>
        <GradeSheetDataTableActions table={table} />
      </DataTable>
    </div>
  );
}
