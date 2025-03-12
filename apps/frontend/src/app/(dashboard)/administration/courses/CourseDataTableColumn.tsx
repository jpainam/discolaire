"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, Trash2 } from "lucide-react";
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
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { Badge } from "@repo/ui/components/badge";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { CreateEditCourse } from "./CreateEditCourse";

type CourseProcedureOutput = RouterOutputs["course"]["all"][number];

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
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
            className="text-muted-foreground w-4 h-4 rounded-full"
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
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteCourseMutation = api.course.delete.useMutation({
    onSettled: () => utils.course.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const canDeleteCourse = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:details",
  );
  const canUpdateCourse = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom:details",
  );

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
