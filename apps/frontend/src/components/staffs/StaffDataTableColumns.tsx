import React from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { TFunction } from "i18next";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { routes } from "~/configs/routes";
import { useAlert } from "~/hooks/use-alert";
import { useSheet } from "~/hooks/use-sheet";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import FlatBadge from "../ui/FlatBadge";
import { CreateEditStaff } from "./CreateEditStaff";

type StaffProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["staff"]["all"]>
>[number];

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
            {t(row.getValue("gender") as string)}
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
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell staff={row.original} />,
    },
  ] as ColumnDef<StaffProcedureOutput, unknown>[];

  const filteredColumns = columns //@ts-ignore
    .map((col) => allcolumns.find((c) => c.accessorKey === col))
    .filter(Boolean) as ColumnDef<StaffProcedureOutput, unknown>[];

  // @ts-ignore
  filteredColumns.push(allcolumns[allcolumns.length - 1]);
  return {
    columns: filteredColumns,
  };
}

function ActionsCell({ staff }: { staff: StaffProcedureOutput }) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const { closeAlert, openAlert } = useAlert();

  const deleteStaffMutation = api.staff.delete.useMutation();
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
                className: "w-[650px] bg-red-500 p-0",
              });
            }}
          >
            <Pencil className="mr-2 size-4" /> {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isDeletePending}
            className="text-destructive"
            onClick={() => {
              startDeleteTransition(() => {
                openAlert({
                  title: t("delete"),
                  description: t("delete_confirmation", {
                    name: getFullName(staff),
                  }),
                  onConfirm: () => {
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
                  },
                  onCancel: () => {
                    closeAlert();
                  },
                });
              });
            }}
          >
            <Trash2 className="mr-2 size-4" /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
