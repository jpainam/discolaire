{
  /*
import { DefaultColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import { Checkbox } from "@repo/ui/checkbox";
import type { DataTableUserStorybook } from "./data";
import { FilterableItems } from "@repo/ui/data-table/data-table-toolbar";

export const getColumns = (): ColumnDef<DataTableUserStorybook>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
    },
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DefaultColumnHeader column={column} title="Username" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DefaultColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DefaultColumnHeader column={column} title="Role" />
        ),
        filterFn: (rows, id, filterValue) => {
            return filterValue.includes(rows.getValue(id));
        },
    },
];

export const filterableItems: FilterableItems = [
    {
        title: "Role",
        tableAccessor: "role",
        options: [
            {
                label: "Admin",
                value: "admin",
            },
            {
                label: "User",
                value: "user",
            },
            {
                label: "Owner",
                value: "owner",
            },
        ],
    },
];*/
}
