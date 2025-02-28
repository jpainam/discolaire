"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import type { FlatBadgeProps } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditAnnouncement } from "./CreateEditAnnouncement";

const statusVariants: Record<string, FlatBadgeProps["variant"]> = {
  active_notice: "green",
  future_notice: "yellow",
  expired_notice: "red",
};

type AnnouncementAllProcedureOutput = NonNullable<
  RouterOutputs["announcement"]["all"]
>[number];

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<AnnouncementAllProcedureOutput, unknown>[] {
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("title")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return <div className="">{noticeboard.title}</div>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return (
          <div className="hover:text-blue-600 hover:underline">
            {noticeboard.description}
          </div>
        );
      },
    },
    {
      accessorKey: "recipients",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("recipients")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return <div className="">{JSON.stringify(noticeboard.recipients)}</div>;
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("level")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return <div className="">{noticeboard.level}</div>;
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        const now = new Date();
        const publishFrom = new Date(noticeboard.from);
        const publishTo = new Date(noticeboard.to);
        let status: string;
        let variant: FlatBadgeProps["variant"];

        if (publishFrom <= now && now <= publishTo) {
          status = t("active_notice");
          variant = statusVariants.active_notice;
        } else if (publishFrom > now) {
          status = t("future_notice");
          variant = statusVariants.future_notice;
        } else {
          status = t("expired_notice");
          variant = statusVariants.expired_notice;
        }

        return <FlatBadge variant={variant}>{status}</FlatBadge>;
      },
    },
    {
      accessorKey: "link",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"URL"} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return (
          <Link className="hover:text-blue-600 hover:underline" href={"#"}>
            {noticeboard.link}
          </Link>
        );
      },
    },
    {
      accessorKey: "from",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("from")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return (
          <div className="hover:text-blue-600 hover:underline">
            {new Date(noticeboard.from).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "to",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("to")} />
      ),
      cell: ({ row }) => {
        const noticeboard = row.original;
        return (
          <div className="hover:text-blue-600 hover:underline">
            {new Date(noticeboard.to).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return <ActionCells noticeboard={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({
  noticeboard,
}: {
  noticeboard: AnnouncementAllProcedureOutput;
}) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();

  const utils = api.useUtils();
  const deleteAnnouncementMutation = api.announcement.delete.useMutation();

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
              openSheet({
                className: "w-[700px]",
                title: (
                  <div className="p-2">
                    {t("edit", { name: noticeboard.title })}
                  </div>
                ),
                view: <CreateEditAnnouncement noticeBoard={noticeboard} />,
              });
            }}
          >
            <Pencil className="mr-2 size-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive text-destructive-foreground"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.promise(
                  deleteAnnouncementMutation.mutateAsync(noticeboard.id),
                  {
                    loading: t("deleting"),
                    success: async () => {
                      await utils.announcement.all.invalidate();
                      return t("deleted_successfully");
                    },
                    error: (error) => getErrorMessage(error),
                  }
                );
              }
            }}
          >
            <Trash2 className="mr-2 size-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
