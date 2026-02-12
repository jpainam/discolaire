"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import type { FlatBadgeProps } from "~/components/FlatBadge";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSheet } from "~/hooks/use-sheet";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
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
  t: Translator<Record<string, never>, never>;
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
          status = t("active");
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

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteAnnouncementMutation = useMutation(
    trpc.announcement.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.announcement.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
          <DropdownMenuItem
            onSelect={() => {
              openSheet({
                title: <>{t("edit", { name: noticeboard.title })}</>,
                view: <CreateEditAnnouncement noticeBoard={noticeboard} />,
              });
            }}
          >
            <Pencil />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-destructive text-destructive-foreground"
            onSelect={async () => {
              await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),

                onConfirm: async () => {
                  await deleteAnnouncementMutation.mutateAsync(noticeboard.id);
                },
              });
            }}
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
