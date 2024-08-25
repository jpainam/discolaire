import Link from "next/link";
import { ColumnDef, Row } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { Eye, MoreVertical, Send, Trash2 } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/v2/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { routes } from "~/configs/routes";
import { SMSHistory } from "~/types/sms";

export function fetchSmsHistoryColumns({
  t,
  dateFormatter,
}: {
  t: TFunction<string, unknown>;
  dateFormatter: Intl.DateTimeFormat;
}) {
  const columns = [
    {
      id: "select",
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("message")} />
      ),
      cell: ({ row }) => {
        const sms = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.administration.sms_management.details(sms.id)}
          >
            {sms.message}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        const history = row.original;
        return <div>{dateFormatter.format(history.createdAt)}</div>;
      },
    },
    {
      accessorKey: "sentAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("sentAt")} />
      ),
      cell: ({ row }) => {
        const history = row.original;
        return (
          <div>{history.sentAt && dateFormatter.format(history.sentAt)}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ] as ColumnDef<SMSHistory, unknown>[];
  return columns;
}

function ActionsCell({ row }: { row: Row<SMSHistory> }) {
  const { t } = useLocale();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant={"ghost"}
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreVertical aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              // actions.onView && actions.onView(row.original);
            }}
          >
            <Eye className="mr-2 h-4 w-4" /> {t("details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // actions.onEdit && actions.onEdit(row.original);
            }}
          >
            <Send className="mr-2 h-4 w-4" /> {t("resend")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="bg-destructive text-destructive-foreground"
            onClick={() => {
              // actions.onDelete && actions.onDelete(row.original);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
