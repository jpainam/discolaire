import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import Link from "next/link";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"][number]
>;

export function fetchAssignmentTableColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<ClassroomGetAssignemntProcedureOutput, unknown>[] {
  const dateFormatter = new Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const shortDateFormatter = new Intl.DateTimeFormat(i18next.language, {
    month: "short",
    day: "numeric",
  });
  return [
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
              row.original.id
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
            {dateFormatter.format(createdAt)}
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
            {visibleFrom && shortDateFormatter.format(visibleFrom)} -{" "}
            {visibleTo && shortDateFormatter.format(visibleTo)}
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
  ];
}

function ActionsCell({
  assignment,
}: {
  assignment: ClassroomGetAssignemntProcedureOutput;
}) {
  const queryClient = useQueryClient();
  const { t } = useLocale();
  const trpc = useTRPC();
  const deleteAssignment = useMutation(
    trpc.assignment.delete.mutationOptions({
      onSuccess: async () => {
        //await queryClient.invalidateQueries(trpc.assignment.pathFilter())
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter()
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const router = useRouter();
  const canDeleteAssignment = useCheckPermission(
    "assignment",
    PermissionAction.DELETE
  );
  const canUpdateAssignment = useCheckPermission(
    "assignment",
    PermissionAction.UPDATE
  );
  const confirm = useConfirm();
  const params = useParams<{ id: string }>();

  return (
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            router.push(
              `/classrooms/${params.id}/assignments/${assignment.id}`
            );
          }}
        >
          <Eye />
          {t("details")}
        </DropdownMenuItem>
        {canUpdateAssignment && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                `/classrooms/${params.id}/assignments/${assignment.id}/edit`
              );
            }}
          >
            <Pencil />
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
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
