import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import { cn } from "@repo/ui/lib/utils";

import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

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
    // {
    //   accessorKey: "name",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("name")} />
    //   ),
    //   cell: ({ row }) => {
    //     const grade = row.original;
    //     return (
    //       <Link
    //         className="hover:text-blue-600 hover:underline"
    //         href={routes.classrooms.gradesheets.details(classroomId, grade.id)}
    //       >
    //         {grade.name}
    //       </Link>
    //     );
    //   },
    //   enableSorting: true,
    // },
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
        <ActionCells classroomId={classroomId} gradesheet={row.original} />
      ),
      size: 60,
      enableSorting: false,
      enableHiding: false,
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

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteGradeSheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );
  const canUpdateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" size={"icon"} variant="ghost">
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateGradesheet && (
            <DropdownMenuItem
              disabled={!gradesheet.isActive || !gradesheet.term.isActive}
              onSelect={() => {
                router.push(
                  routes.classrooms.gradesheets.edit(
                    classroomId,
                    gradesheet.id,
                  ),
                );
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteGradesheet && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={
                  deleteGradeSheetMutation.isPending ||
                  !gradesheet.isActive ||
                  !gradesheet.term.isActive
                }
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    //icon: <Trash2 className="text-destructive" />,
                    // alertDialogTitle: {
                    //   className: "flex items-center gap-2",
                    // },
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteGradeSheetMutation.mutate(gradesheet.id);
                  }
                }}
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
