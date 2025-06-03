import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import Link from "next/link";

import type { RouterOutputs } from "@repo/api";
import { Checkbox } from "@repo/ui/components/checkbox";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { cn } from "@repo/ui/lib/utils";
import { routes } from "~/configs/routes";

export function fetchGradeSheetColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<RouterOutputs["gradeSheet"]["all"][number], unknown>[] {
  const startDateFormatter = Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "2-digit",
    year: "2-digit",
  });
  // const endDateFormatter = Intl.DateTimeFormat(i18next.language, {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });
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
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      size: 100,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;

        return (
          <span className="text-muted-foreground">
            {startDateFormatter.format(createdAt)}
          </span>
        );
      },
    },

    {
      accessorKey: "subject.course.reportName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        return (
          <span className="text-muted-foreground">
            {subject.course.reportName}
          </span>
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
            {teacher?.lastName}
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "subject.coefficient",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("coeff")} />
    //   ),
    //   size: 50,
    //   cell: ({ row }) => {
    //     const subject = row.original.subject;
    //     return (
    //       <div className="text-muted-foreground">{subject.coefficient}</div>
    //     );
    //   },
    // },
    {
      accessorKey: "subject.classroom.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("graded")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const numGrades = row.original.grades.length || 0;
        return <div className="text-muted-foreground">{numGrades}</div>;
      },
    },
    {
      accessorKey: "grades",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("absent")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const numIsAbsent = row.original.grades.filter(
          (g) => g.isAbsent
        ).length;
        return (
          <div className={cn(numIsAbsent == 0 ? "" : "text-destructive")}>
            {numIsAbsent}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "isAbsent",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("avg")} />
    //   ),
    //   size: 60,
    //   cell: ({ row }) => {
    //     const grades = row.original.grades;
    //     const avg =
    //       grades.reduce((acc, grade) => {
    //         if (grade.grade === null || grade.grade === undefined) {
    //           return acc;
    //         }
    //         return acc + grade.grade;
    //       }, 0) / grades.length;

    //     const min = Math.min(...grades.map((g) => g.grade));
    //     const max = Math.max(...grades.map((g) => g.grade));

    //     if (!isFinite(avg)) {
    //       return <FlatBadge variant="gray">N/A</FlatBadge>;
    //     }
    //     return (
    //       <Badge variant={"outline"}>
    //         {min.toFixed(2)} / {avg.toFixed(2)} / {max.toFixed(2)}
    //       </Badge>
    //     );
    //   },
    // },

    // {
    //   accessorKey: "weight",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("weight")} />
    //   ),
    //   size: 60,
    //   cell: ({ row }) => {
    //     const weight = row.original.weight;
    //     return <div>{weight || 0} %</div>;
    //   },
    // },
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
  ];
}
