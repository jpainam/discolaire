import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import type { RouterOutputs } from "@repo/api";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import { Switch } from "@repo/ui/switch";

type User = RouterOutputs["user"]["all"][number];

export function getUserColumns({
  t,
  fullDateFormatter,
}: {
  t: TFunction<string, unknown>;
  fullDateFormatter: Intl.DateTimeFormat;
}) {
  return [
    {
      accessorKey: "selected",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avatar" />
      ),
      cell: ({ row }) => (
        <Avatar className="flex h-[20px] w-[20px] items-center justify-center rounded">
          <AvatarImage src={row.original.avatar ?? ""} alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      cell: ({ row }) => <div className="flex">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("is_email_verified")} />
      ),
      cell: () => <Switch checked={false} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        return fullDateFormatter.format(new Date(row.getValue("createdAt")));
      },
    },
  ] as ColumnDef<User, unknown>[];
}
