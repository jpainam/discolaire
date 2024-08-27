import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import { Switch } from "@repo/ui/switch";
import type { ColumnDef} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { TFunction } from "i18next";

const columnHelper = createColumnHelper<User>();

export function getUserColumns({
  t,
  fullDateFormatter,
}: {
  t: TFunction<string, unknown>;
  fullDateFormatter: Intl.DateTimeFormat;
}): ColumnDef<User, unknown>[] {
  return [
    columnHelper.accessor<"id", string>("id", {
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
    }),
    columnHelper.accessor<"avatar", string>("avatar", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avatar" />
      ),
      cell: ({ row }) => (
        <Avatar className="flex h-[20px] w-[20px] items-center justify-center rounded">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      ),
    }),
    columnHelper.accessor<"email", string>("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      cell: ({ row }) => <div className="flex">{row.getValue("email")}</div>,
    }),
    columnHelper.accessor<"isEmailVerified", boolean>("isEmailVerified", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("is_email_verified")} />
      ),
      cell: ({ row }) => <Switch checked={row.getValue("isEmailVerified")} />,
    }),
    columnHelper.accessor<"createdAt", Date>("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        return fullDateFormatter.format(new Date(row.getValue("createdAt")));
      },
    }),
  ] as ColumnDef<User, unknown>[];
}
