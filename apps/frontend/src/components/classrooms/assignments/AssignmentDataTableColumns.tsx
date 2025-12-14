import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, EditIcon, ViewIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"][number]
>;

export function useAssignmentTableColumns(): ColumnDef<
  ClassroomGetAssignemntProcedureOutput,
  unknown
>[] {
  const locale = useLocale();
  const t = useTranslations();

  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "subject",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("subject")} />
        ),
        cell: ({ row }) => {
          const subject = row.original.subject;
          return (
            <div className="text-muted-foreground">
              {subject.course.shortName}
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("title")} />
        ),
        cell: ({ row }) => {
          return (
            <Link
              className="truncate hover:text-blue-600 hover:underline"
              href={routes.classrooms.assignments.details(
                row.original.classroomId,
                row.original.id,
              )}
            >
              {row.original.title}
            </Link>
          );
        },
      },
      // {
      //   accessorKey: "description",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title={t("description")} />
      //   ),
      //   cell: ({ row }) => {
      //     const description = row.original.description;
      //     return <div className="truncate">{description}</div>;
      //   },
      // },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("createdAt")} />
        ),
        cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          return (
            <div className="text-muted-foreground">
              {createdAt.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "from",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("visible")} />
        ),
        cell: ({ row }) => {
          const visibleFrom = row.original.from;
          const visibleTo = row.original.to;
          return (
            <div className="text-muted-foreground">
              {visibleFrom?.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {visibleTo?.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "term.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("term")} />
        ),
        cell: ({ row }) => {
          const ass = row.original;
          return <div className="text-muted-foreground">{ass.term.name}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => <ActionsCell assignment={row.original} />,
        size: 58,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [locale, t],
  );
}

function ActionsCell({
  assignment,
}: {
  assignment: ClassroomGetAssignemntProcedureOutput;
}) {
  const queryClient = useQueryClient();

  const t = useTranslations();
  const trpc = useTRPC();
  const deleteAssignment = useMutation(
    trpc.assignment.delete.mutationOptions({
      onSuccess: async () => {
        //await queryClient.invalidateQueries(trpc.assignment.pathFilter())
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const router = useRouter();
  const canDeleteAssignment = useCheckPermission(
    "assignment",
    PermissionAction.DELETE,
  );
  const canUpdateAssignment = useCheckPermission(
    "assignment",
    PermissionAction.UPDATE,
  );
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            router.push(
              `/classrooms/${params.id}/assignments/${assignment.id}`,
            );
          }}
        >
          <ViewIcon />
          {t("details")}
        </DropdownMenuItem>
        {canUpdateAssignment && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                `/classrooms/${params.id}/assignments/${assignment.id}/edit`,
              );
            }}
          >
            <EditIcon />
            {t("edit")}
          </DropdownMenuItem>
        )}
        {canDeleteAssignment && (
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.loading(t("deleting"), { id: 0 });
                deleteAssignment.mutate(assignment.id);
              }
            }}
          >
            <DeleteIcon />
            {t("delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
