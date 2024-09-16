import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import i18next from "i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type ClassroomGradeSheetProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["gradesheets"]
>[number];

export function fetchGradeSheetColumns({
  t,
  classroomId,
}: {
  t: TFunction<string, unknown>;
  classroomId: string;
}): ColumnDef<ClassroomGradeSheetProcedureOutput, unknown>[] {
  const startDateFormatter = Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
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
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("date")} />
      ),
      cell: ({ row }) => {
        const startDate = row.original.startDate;
        //const endDate = row.original.endDate;
        return (
          <div>
            {startDate && startDateFormatter.format(new Date(startDate))}
            {/* -{" "}
            {endDate && endDateFormatter.format(new Date(endDate))} */}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const grade = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.classrooms.gradesheets.details(classroomId, grade.id)}
          >
            {grade.name}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "subject.course.reportName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        return <div>{subject.course?.reportName}</div>;
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
    {
      accessorKey: "subject.coefficient",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("coeff")} />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        return <div>{subject.coefficient}</div>;
      },
    },
    {
      accessorKey: "num_grades",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("graded")} />
      ),
      cell: ({ row }) => {
        const numGrades = row.original.num_grades || 0;
        return <div>{numGrades}</div>;
      },
    },
    {
      accessorKey: "num_is_absent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("absent")} />
      ),
      cell: ({ row }) => {
        const numIsAbsent = row.original.num_is_absent || 0;
        return (
          <div
            className={cn(
              "font-bold",
              numIsAbsent == 0 ? "text-green-500" : "text-destructive",
            )}
          >
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
      cell: ({ row }) => {
        const min = row.original.min || 0;
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
      cell: ({ row }) => {
        const max = row.original.max || 0;
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
        <ActionCells classroomId={classroomId} gradesheet={row.original} />
      ),
    },
  ];
}

function ActionCells({
  gradesheet,
  classroomId,
}: {
  classroomId: string;
  gradesheet: ClassroomGradeSheetProcedureOutput;
}) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const deleteGradeSheetMutation = api.gradeSheet.delete.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                routes.classrooms.gradesheets.details(
                  classroomId,
                  gradesheet.id,
                ),
              );
            }}
          >
            <Eye className="mr-2 size-4" />
            {t("details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                routes.classrooms.gradesheets.edit(classroomId, gradesheet.id),
              );
            }}
          >
            <Pencil className="mr-2 size-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteGradeSheetMutation.isPending}
            className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.promise(
                  deleteGradeSheetMutation.mutateAsync(gradesheet.id),
                  {
                    loading: t("deleting"),
                    success: () => {
                      void utils.gradeSheet.invalidate();
                      void utils.grade.invalidate();
                      return t("deleted_successfully");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              }
            }}
          >
            <Trash2 className="mr-2 size-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
