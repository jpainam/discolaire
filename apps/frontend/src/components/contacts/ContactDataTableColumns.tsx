"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, Trash2, Users } from "lucide-react";
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
import { useConfirm } from "~/providers/confirm-dialog";

import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { AvatarState } from "../AvatarState";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import CreateEditContact from "./CreateEditContact";
import StudentContactList from "./StudentContactList";

type ContactAllProcedureOutput = NonNullable<
  RouterOutputs["contact"]["all"]
>[number];

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<ContactAllProcedureOutput, unknown>[] {
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
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="" />
      ),
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <AvatarState
            pos={getFullName(contact).length}
            avatar={contact.avatar}
          />
        );
      },
    },
    {
      accessorKey: "prefix",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("civ.")} />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("prefix")}</div>;
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const v = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.contacts.details(v.id)}
          >
            {v.lastName}
          </Link>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const v = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.contacts.details(v.id)}
          >
            {v.firstName}
          </Link>
        );
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        const contact = row.original;
        const gender = contact.gender;
        return (
          <FlatBadge
            variant={contact.gender == "female" ? "pink" : "blue"}
            className="flex w-[80px] flex-row items-center gap-1"
          >
            {contact.gender == "male" ? (
              <PiGenderMaleThin className="h-4 w-4" />
            ) : (
              <PiGenderFemaleThin className="h-4 w-4" />
            )}
            {t(`${gender}`)}
          </FlatBadge>
        );
      },
    },
    {
      accessorKey: "phoneNumber1",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("phone")} />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("phoneNumber1")}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("email")} />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("email")}</div>;
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const { openSheet } = useSheet();
        const confirm = useConfirm();
        const contact = row.original;
        const utils = api.useUtils();
        const deleteContactMutation = api.contact.delete.useMutation({
          onSettled: () => utils.contact.all.invalidate(),
        });

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost">
                <DotsHorizontalIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  openSheet({
                    className: "w-[500px]",
                    title: <div className="p-2">{t("students")}</div>,
                    view: <StudentContactList contactId={contact.id} />,
                  });
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span className="text-sm">{t("students")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onSelect={() => {
                  openSheet({
                    placement: "right",
                    className: "w-[500px]",
                    view: <CreateEditContact contact={row.original} />,
                  });
                }}
              >
                <Pencil className="h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownInvitation email={contact.email} />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={deleteContactMutation.isPending}
                className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.promise(
                      deleteContactMutation.mutateAsync(contact.id),
                      {
                        loading: t("deleting"),
                        success: () => {
                          return t("deleted_successfully");
                        },
                        error: (error) => {
                          return getErrorMessage(error);
                        },
                      }
                    );
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
