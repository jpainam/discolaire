import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { Eye, MoreVertical, Send, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { SMSHistory } from "~/types/sms";
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

export function useSmsHistoryColumns() {
  const locale = useLocale();
  const t = useTranslations();

  return useMemo(
    () =>
      [
        {
          id: "select",
          accessorKey: "select",
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
            return (
              <div>
                {history.createdAt.toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            );
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
              <div>
                {history.sentAt?.toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            );
          },
        },
        {
          id: "actions",
          cell: ({ row }) => <ActionsCell row={row} />,
          size: 60,
          enableSorting: false,
          enableHiding: false,
        },
      ] as ColumnDef<SMSHistory, unknown>[],
    [locale, t],
  );
}

function ActionsCell({ row }: { row: Row<SMSHistory> }) {
  const t = useTranslations();
  console.log(row);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant={"ghost"}
            className="data-[state=open]:bg-muted flex size-8 p-0"
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
            <Eye /> {t("details")}
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
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
