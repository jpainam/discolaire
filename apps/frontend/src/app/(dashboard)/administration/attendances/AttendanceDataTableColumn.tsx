"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type ProcedureOutput = RouterOutputs["attendance"]["all"][number];

function getTotalIssues(a: ProcedureOutput) {
  return (
    a.absence +
    a.chatter +
    a.exclusion +
    a.late -
    a.justifiedAbsence -
    a.justifiedLate
  );
}

function getSeverity(total: number) {
  if (total === 0) return { label: "Good", variant: "success" as const };
  if (total <= 3) return { label: "Warning", variant: "warning" as const };
  return { label: "Critical", variant: "destructive" as const };
}

export function useColumns(): ColumnDef<ProcedureOutput, unknown>[] {
  return useMemo(
    () => [
      {
        id: "select",
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
          <DataTableColumnHeader column={column} title={"createdAt"} />
        ),
        size: 55,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground">
              {att.createdAt.toLocaleDateString()}
            </div>
          );
        },
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"lastName"} />
        ),
        cell: ({ row }) => {
          const att = row.original;
          return (
            <Link
              className="line-clamp-1 hover:text-blue-600 hover:underline"
              href={`/students/${att.studentId}/attendances`}
            >
              {getFullName(att.student)}
            </Link>
          );
        },
      },
      {
        accessorKey: "absence",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"absence"} />
        ),
        size: 100,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex flex-row gap-2">
              {att.absence}{" "}
              {att.justifiedAbsence > 0 && (
                <Badge appearance={"outline"} variant={"warning"}>
                  {att.justifiedAbsence} justifiées
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "chatter",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"chatter"} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return <div className="text-muted-foreground">{att.chatter}</div>;
        },
      },
      {
        accessorKey: "consigne",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"consigne"} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return <div className="text-muted-foreground">{att.consigne}</div>;
        },
      },
      {
        accessorKey: "late",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"late"} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return <div className="text-muted-foreground">{att.late}</div>;
        },
      },
      {
        accessorKey: "exclusion",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"exclusion"} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return <div className="text-muted-foreground">{att.exclusion}</div>;
        },
      },

      {
        accessorKey: "termId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"term"} />
        ),
        size: 120,
        cell: ({ row }) => {
          const att = row.original;
          return <div className="text-muted-foreground">{att.term.name}</div>;
        },
      },
      {
        accessorKey: "student.userId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={"exclusion"} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          const total = getTotalIssues(att);
          const sev = getSeverity(total);
          return (
            <Badge variant={sev.variant} appearance="outline">
              {sev.label}
            </Badge>
          );
        },
      },

      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: function Cell({ row }) {
          return <ActionCells attendance={row.original} />;
        },
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActionCells({ attendance }: { attendance: ProcedureOutput }) {
  const confirm = useConfirm();

  const t = useTranslations();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              // router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateClassroom && (
            <DropdownMenuItem
              onSelect={() => {
                // openSheet({
                //   description: t("edit_classroom_description"),
                //   title: t("edit_a_classroom"),
                //   view: <CreateEditClassroom classroom={classroom} />,
                // });
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
                    //deleteClassroomMutation.mutate(classroom.id);
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
