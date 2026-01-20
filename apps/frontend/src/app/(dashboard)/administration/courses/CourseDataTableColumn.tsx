"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditCourse } from "./CreateEditCourse";

type CourseProcedureOutput = RouterOutputs["course"]["all"][number];

export function getColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
}): ColumnDef<CourseProcedureOutput, unknown>[] {
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
      size: 20,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "color",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div
            className="text-muted-foreground h-4 w-4 rounded-full"
            style={{ backgroundColor: course.color }}
          ></div>
        );
      },
      size: 20,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("code")} />
      ),
      cell: ({ row }) => {
        const course = row.original;
        return <div className="text-muted-foreground">{course.shortName}</div>;
      },
      size: 60,
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        return <>{row.original.name}</>;
      },
    },
    {
      accessorKey: "reportName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("reportName")} />
      ),
      cell: ({ row }) => {
        const course = row.original;
        return <div className="text-muted-foreground">{course.reportName}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("is_active")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const course = row.original;
        return (
          <>
            {course.isActive ? (
              <Badge variant={"outline"}>{t("yes")}</Badge>
            ) : (
              <Badge variant="destructive">{t("no")}</Badge>
            )}
          </>
        );
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells course={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({ course }: { course: CourseProcedureOutput }) {
  const t = useTranslations();
  const confirm = useConfirm();

  const { openModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteCourseMutation = useMutation(
    trpc.course.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.course.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canDeleteCourse = useCheckPermission("classroom.delete");
  const canUpdateCourse = useCheckPermission("classroom.update");

  return (
    <div className="flex justify-end">
      <DropdownMenu>
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
          {canUpdateCourse && (
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("edit") + " - " + course.name,
                  view: <CreateEditCourse course={course} />,
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteCourse && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteCourse}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteCourseMutation.mutate(course.id);
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
