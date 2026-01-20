"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditClassroom } from "./CreateEditClassroom";

type ClassroomProcedureOutput = RouterOutputs["classroom"]["all"][number];

export function getColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
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
        const avatar = createAvatar(initials, {
          seed: classroom.name,
        });
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar className="size-[26px] shrink-0">
              <AvatarImage
                src={avatar.toDataUri()}
                alt={classroom.reportName}
              />
              <AvatarFallback>
                {classroom.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link
              className="line-clamp-1 text-xs hover:underline"
              href={routes.classrooms.details(classroom.id)}
            >
              {classroom.name}
            </Link>
          </div>
        );
      },
    },

    {
      accessorKey: "maxSize",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("effective")} />
      ),
      size: 60,
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
      size: 60,
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
      size: 60,
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

  const t = useTranslations();
  const router = useRouter();

  const canDeleteClassroom = useCheckPermission("classroom.delete");
  const canUpdateClassroom = useCheckPermission("classroom.update");
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
            <ViewIcon />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateClassroom && (
            <DropdownMenuItem
              onSelect={() => {
                const formId = `edit-classroom-form-${classroom.id}`;
                openSheet({
                  formId,
                  description: classroom.name,
                  title: t("edit"),
                  view: (
                    <CreateEditClassroom
                      formId={formId}
                      classroom={classroom}
                    />
                  ),
                });
              }}
            >
              <EditIcon />
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
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
