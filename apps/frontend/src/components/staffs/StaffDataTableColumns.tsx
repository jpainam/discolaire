import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import Link from "next/link";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
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
import FlatBadge from "~/components/FlatBadge";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { CreateEditStaff } from "./CreateEditStaff";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];
export function fetchStaffColumns({
  t,
  columns,
}: {
  t: TFunction<string, unknown>;
  columns: string[];
}): {
  columns: ColumnDef<StaffProcedureOutput, unknown>[];
} {
  const allcolumns = [
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
      id: "avatar",
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        return (
          <AvatarState
            avatar={row.original.avatar}
            pos={getFullName(row.original).length}
          />
        );
      },
    },

    {
      id: "lastName",
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.staffs.details(staff.id)}
          >
            {staff.lastName}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.staffs.details(staff.id)}
          >
            {staff.firstName}
          </Link>
        );
      },
    },
    {
      id: "fullName",
      accessorKey: "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fullName")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.staffs.details(staff.id)}
          >
            {getFullName(staff)}
          </Link>
        );
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        const gender = staff.gender;
        return (
          <FlatBadge
            variant={staff.gender == "female" ? "pink" : "blue"}
            className="flex w-[80px] flex-row items-center gap-1"
          >
            {staff.gender == "male" ? (
              <PiGenderMaleThin className="h-4 w-4" />
            ) : (
              <PiGenderFemaleThin className="h-4 w-4" />
            )}

            {t(gender)}
          </FlatBadge>
        );
      },
      enableSorting: true,
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "jobTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("jobTitle")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "phoneNumber1",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("phone")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("email")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("active")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "degree",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("degree")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return <div>{staff.degree?.name}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "employmentType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("employmentType")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return <div>{t(staff.employmentType ?? "")}</div>;
      },
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell staff={row.original} />,
    },
  ] as ColumnDef<StaffProcedureOutput, unknown>[];

  const filteredColumns = columns // @ts-expect-error TODO: fix type
    .map((col) => allcolumns.find((c) => c.accessorKey === col))
    .filter(Boolean) as ColumnDef<StaffProcedureOutput, unknown>[];

  // @ts-expect-error TODO: fix type
  filteredColumns.push(allcolumns[allcolumns.length - 1]);
  return {
    columns: filteredColumns,
  };
}

function ActionsCell({ staff }: { staff: StaffProcedureOutput }) {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const deleteStaffMutation = api.staff.delete.useMutation({
    onSettled: () => utils.staff.invalidate(),
  });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant={"ghost"}
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <ReceiptText className="mr-2 size-4" />
            <span className="text-sm">{t("details")}</span>
          </DropdownMenuItem>
          <DropdownInvitation email={staff.email} />
          <DropdownMenuItem
            className=""
            onClick={() => {
              openSheet({
                view: <CreateEditStaff staff={staff} />,
                title: t("edit_staff"),
                description: `${getFullName(staff)}`,
                className: "w-[750px]",
              });
            }}
          >
            <Pencil className="mr-2 size-4" /> {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteStaffMutation.isPending}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            onClick={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation", {
                  name: getFullName(staff),
                }),
              });
              if (isConfirmed) {
                toast.promise(deleteStaffMutation.mutateAsync(staff.id), {
                  loading: t("deleting"),
                  success: () => {
                    return t("deleted_successfully");
                  },
                  error: (err) => {
                    console.error(err);
                    return getErrorMessage(err);
                  },
                });
              }
            }}
          >
            <Trash2 className="mr-2 size-4" /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
