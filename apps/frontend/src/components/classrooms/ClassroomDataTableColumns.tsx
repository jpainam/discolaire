"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Eye,
  MoveRight,
  Pencil,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
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
import { api } from "~/trpc/react";
import { CreateEditClassroom } from "./CreateEditClassroom";

type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function getColumns({
  t,
  canDeleteClassroom,
}: {
  t: TFunction<string, unknown>;
  canDeleteClassroom: boolean;
}): ColumnDef<ClassroomProcedureOutput, unknown>[] {
  return [
    {
      id: "select",
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const classroom = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.classrooms.details(classroom.id)}
          >
            {classroom.name}
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "reportName",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("class_name_report")} />
    //   ),
    //   cell: ({ row }) => {
    //     const classroom = row.original;
    //     return (
    //       <Link
    //         className="hover:underline hover:text-blue-600"
    //         href={routes.classrooms.details(classroom.id)}
    //       >
    //         {classroom.reportName}
    //       </Link>
    //     );
    //   },
    // },
    // {

    {
      accessorKey: "maxSize",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("effective")} />
      ),
      cell: ({ row }) => {
        const maxSize = row.original.maxSize || 0;
        const currentSize = row.original.size || 0;
        return (
          <FlatBadge
            variant={
              currentSize < maxSize / 2
                ? "green"
                : currentSize > maxSize / 2 && currentSize < maxSize
                  ? "yellow"
                  : "red"
            }
          >
            {currentSize}/{maxSize}
          </FlatBadge>
        );
      },
    },
    {
      accessorKey: "maleCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("boys")} />
      ),
      cell: ({ row }) => {
        const classroom = row.original;
        const maleCount = classroom.maleCount || 0;
        const femaleCount = classroom.femaleCount || 0;
        return (
          <div className="flex flex-row items-center gap-1">
            <span>{maleCount}</span>
            {maleCount > femaleCount ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : maleCount < femaleCount ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <MoveRight className="h-4 w-4 text-indigo-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "femaleCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("girls")} />
      ),
      cell: ({ row }) => {
        const classroom = row.original;
        const maleCount = classroom.maleCount || 0;
        const femaleCount = classroom.femaleCount || 0;
        return (
          <div className="flex flex-row items-center gap-1">
            <span>{femaleCount}</span>
            {maleCount < femaleCount ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : maleCount > femaleCount ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <MoveRight className="h-4 w-4 text-indigo-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "headTeacherId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("head_teacher")} />
      ),
      cell: ({ row }) => {
        const teacher = row.original.headTeacher;
        return teacher ? (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.staffs.details(teacher.id)}
          >
            {teacher.lastName}
          </Link>
        ) : (
          <></>
        );
      },
    },
    // {
    //   accessorKey: "seniorAdvisorId",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("senior_advisor")} />
    //   ),
    //   cell: ({ row }) => {
    //     const teacher = row.original.seniorAdvisor;
    //     return teacher ? (
    //       <Link
    //         className="hover:underline hover:text-blue-600"
    //         href={routes.staffs.details(teacher?.id)}
    //       >
    //         {teacher.lastName}
    //       </Link>
    //     ) : (
    //       <></>
    //     );
    //   },
    // },
    {
      accessorKey: "levelId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("level")} />
      ),
      cell: ({ row }) => {
        const level = row.original.level;
        return <div>{level.name}</div>;
      },
      filterFn: (row, id, value) => {
        return (
          Array.isArray(value) &&
          Array.from(value, Number).includes(row.getValue(id))
        );
      },
    },
    {
      accessorKey: "cycleId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("cycle")} />
      ),
      cell: ({ row }) => {
        const cycle = row.original.cycle;
        return <div>{cycle?.name}</div>;
      },
      filterFn: (row, id, value) => {
        return (
          Array.isArray(value) &&
          Array.from(value, Number).includes(row.getValue(id))
        );
      },
    },
    {
      accessorKey: "sectionId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("section")} />
      ),
      cell: ({ row }) => {
        const section = row.original.section;
        return <div>{section?.name}</div>;
      },
      filterFn: (row, id, value) => {
        return (
          Array.isArray(value) &&
          Array.from(value, Number).includes(row.getValue(id))
        );
      },
    },
    // {
    //   accessorKey: "classroomLeaderId",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("classroom_leader")} />
    //   ),
    //   cell: ({ row }) => {
    //     const leader = row.original.classroomLeader;
    //     return leader ? (
    //       <Link
    //         className="hover:underline hover:text-blue-600"
    //         href={routes.students.details(leader?.id)}
    //       >
    //         {leader.lastName}
    //       </Link>
    //     ) : (
    //       <></>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("createdAt")} />
    //   ),
    //   cell: ({ cell }) => formatDate(cell.getValue() as Date),
    // },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <ActionCells
            canDeleteClassroom={canDeleteClassroom}
            classroom={row.original}
          />
        );
      },
    },
  ];
}

function ActionCells({
  classroom,
  canDeleteClassroom,
}: {
  classroom: ClassroomProcedureOutput;
  canDeleteClassroom: boolean;
}) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const router = useRouter();
  const utils = api.useUtils();
  const classroomMutation = api.classroom.delete.useMutation({
    onSettled: () => utils.classroom.invalidate(),
  });

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
              router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <Eye className="mr-2 size-4" />
            {t("details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              openSheet({
                className: "w-[700px]",
                title: (
                  <div className="p-2">
                    {t("edit", { name: classroom.name })}
                  </div>
                ),
                view: <CreateEditClassroom classroom={classroom} />,
              });
            }}
          >
            <Pencil className="mr-2 size-4" />
            {t("edit")}
          </DropdownMenuItem>
          {canDeleteClassroom && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteClassroom}
                className="bg-destructive text-destructive-foreground"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.promise(classroomMutation.mutateAsync(classroom.id), {
                      loading: t("deleting"),
                      success: () => {
                        return t("deleted_successfully");
                      },
                      error: (error) => {
                        return getErrorMessage(error);
                      },
                    });
                  }
                }}
              >
                <Trash2 className="mr-2 size-4" />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
