"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
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
import { ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

type ProcedureOutput = RouterOutputs["attendance"]["list"]["data"][number];

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
  const t = useTranslations();
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
          <DataTableColumnHeader column={column} title={t("lastName")} />
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
          <DataTableColumnHeader
            className="justify-center"
            column={column}
            title={t("absence")}
          />
        ),
        size: 100,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex flex-row justify-center gap-2">
              {att.absence}{" "}
              {att.justifiedAbsence > 0 && (
                <Badge appearance={"light"} size={"xs"} variant={"warning"}>
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
          <DataTableColumnHeader
            className="flex justify-center"
            column={column}
            title={t("chatter")}
          />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex justify-center">
              {att.chatter}
            </div>
          );
        },
      },
      {
        accessorKey: "consigne",
        header: ({ column }) => (
          <DataTableColumnHeader
            className="flex justify-center"
            column={column}
            title={t("consigne")}
          />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex justify-center">
              {att.consigne}
            </div>
          );
        },
      },
      {
        accessorKey: "late",
        header: ({ column }) => (
          <DataTableColumnHeader
            className="flex justify-center"
            column={column}
            title={t("late")}
          />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex justify-center">
              {att.late}
            </div>
          );
        },
      },
      {
        accessorKey: "exclusion",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="flex justify-center"
            title={t("exclusion")}
          />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          return (
            <div className="text-muted-foreground flex justify-center">
              {att.exclusion}
            </div>
          );
        },
      },

      {
        accessorKey: "termId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("term")} />
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
          <DataTableColumnHeader column={column} title={t("status")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const att = row.original;
          const total = getTotalIssues(att);
          const sev = getSeverity(total);
          return (
            <Badge variant={sev.variant} size={"xs"} appearance="light">
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
    [t],
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActionCells({ attendance }: { attendance: ProcedureOutput }) {
  const confirm = useConfirm();

  const t = useTranslations();

  const canDeleteClassroom = useCheckPermission("classroom.delete");
  const canUpdateClassroom = useCheckPermission("classroom.update");
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
          <Button size={"icon"} variant="ghost">
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              // router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <ViewIcon />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateClassroom && (
            <DropdownMenuItem
              onSelect={() => {
                // openSheet({
                //   description: t("edit"),
                //   title: t("classroom"),
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
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),

                    onConfirm: () => {
                      //deleteClassroomMutation.mutate(classroom.id);
                    },
                  });
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
