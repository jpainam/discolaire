"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditClassroom } from "./CreateEditClassroom";

type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const classroom = row.original;
        return (
          <Link
            className="line-clamp-1 hover:text-blue-600 hover:underline"
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
            className="line-clamp-1 overflow-ellipsis hover:text-blue-600 hover:underline"
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
          Array.from(value, Number).includes(Number(row.getValue(id)))
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
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells classroom={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({ classroom }: { classroom: ClassroomProcedureOutput }) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const router = useRouter();

  const canDeleteClassroom = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  const canUpdateClassroom = useCheckPermission(
    "classroom",
    PermissionAction.UPDATE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteClassroomMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateClassroom && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  description: t("edit_classroom_description"),
                  title: t("edit_a_classroom"),
                  view: <CreateEditClassroom classroom={classroom} />,
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteClassroom && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteClassroom}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteClassroomMutation.mutate(classroom.id);
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
