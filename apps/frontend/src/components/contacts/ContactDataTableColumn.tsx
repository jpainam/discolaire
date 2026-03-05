"use client";

import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
import { Pencil, ReceiptText, Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

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
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { UserLink } from "../UserLink";
import { ContactStudentList } from "./ContactStudentList";
import CreateEditContact from "./CreateEditContact";

type ContactAllProcedureOutput =
  RouterOutputs["contact"]["all"]["data"][number];

export const contactDefaultColumnVisibility: VisibilityState = {
  firstName: false,
  lastName: false,
  prefix: false,
  phoneNumber2: false,
  email: false,
  address: false,
  occupation: false,
  employer: false,
  isActive: false,
  country: false,
  createdAt: false,
  observation: false,
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(
    new Date(date),
  );
}

export function useContactColumns(): ColumnDef<
  ContactAllProcedureOutput,
  unknown
>[] {
  const t = useTranslations();
  return useMemo(
    () =>
      [
        {
          id: "select",
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
          id: "avatar",
          accessorFn: (contact) => getFullName(contact),
          size: 220,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="" />
          ),
          cell: ({ row }) => {
            const contact = row.original;
            return (
              <UserLink
                id={contact.id}
                profile="contact"
                name={getFullName(contact)}
                avatar={contact.avatar}
                rootClassName="min-w-0"
                className="min-w-0 truncate"
              />
            );
          },
          enableSorting: false,
          enableHiding: false,
        },
        {
          id: "prefix",
          accessorKey: "prefix",
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("civ")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.prefix}</div>
          ),
        },
        {
          id: "firstName",
          accessorKey: "firstName",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("firstName")} />
          ),
          cell: ({ row }) => {
            const contact = row.original;
            return (
              <Link
                className="line-clamp-1 hover:text-blue-600 hover:underline"
                href={routes.contacts.details(contact.id)}
              >
                {contact.firstName && decode(contact.firstName)}
              </Link>
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
            const contact = row.original;
            return (
              <Link
                className="text-muted-foreground line-clamp-1 hover:text-blue-600 hover:underline"
                href={routes.contacts.details(contact.id)}
              >
                {contact.lastName && decode(contact.lastName)}
              </Link>
            );
          },
        },
        {
          id: "gender",
          accessorKey: "gender",
          size: 120,
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
          id: "phoneNumber1",
          accessorKey: "phoneNumber1",
          size: 140,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("phone")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.phoneNumber1}
            </div>
          ),
        },
        {
          id: "phoneNumber2",
          accessorKey: "phoneNumber2",
          size: 140,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("phoneNumber2")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.phoneNumber2}
            </div>
          ),
        },
        {
          id: "email",
          accessorFn: (contact) => contact.user?.email ?? contact.email ?? "",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("email")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.user?.email ?? row.original.email}
            </div>
          ),
        },
        {
          id: "address",
          accessorKey: "address",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("address")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.address}</div>
          ),
        },
        {
          id: "occupation",
          accessorKey: "occupation",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("occupation")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.occupation}
            </div>
          ),
        },
        {
          id: "employer",
          accessorKey: "employer",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("employer")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.employer}</div>
          ),
        },
        {
          id: "isActive",
          accessorKey: "isActive",
          size: 100,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("status")} />
          ),
          cell: ({ row }) => {
            const active = row.original.isActive;
            return (
              <FlatBadge variant={active ? "green" : "red"}>
                {active ? t("active") : t("inactive")}
              </FlatBadge>
            );
          },
        },
        {
          id: "country",
          accessorFn: (contact) => contact.country?.name ?? "",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("country")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.country?.name}
            </div>
          ),
        },
        {
          id: "createdAt",
          accessorFn: (contact) => contact.createdAt.toString(),
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("createdAt")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.createdAt)}
            </div>
          ),
        },
        {
          id: "observation",
          accessorKey: "observation",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("observation")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground line-clamp-1">
              {row.original.observation}
            </div>
          ),
        },
        {
          id: "actions",
          cell: ({ row }) => <ActionsCell contact={row.original} />,
          size: 60,
          enableSorting: false,
          enableHiding: false,
        },
      ] as ColumnDef<ContactAllProcedureOutput, unknown>[],
    [t],
  );
}

function ActionsCell({ contact }: { contact: ContactAllProcedureOutput }) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();

  const t = useTranslations();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const canDeleteContact = useCheckPermission("contact.delete");
  const canUpdateContact = useCheckPermission("contact.update");
  const deleteContactMutation = useMutation(
    trpc.contact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.contact.all.pathFilter()),
          queryClient.invalidateQueries(trpc.contact.search.pathFilter()),
        ]);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const router = useRouter();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost">
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/contacts/${contact.id}`);
            }}
          >
            <ReceiptText />
            {t("details")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              openSheet({
                title: t("students"),
                view: <ContactStudentList contactId={contact.id} />,
              });
            }}
          >
            <Users />
            <span className="text-sm">{t("students")}</span>
          </DropdownMenuItem>
          {canUpdateContact && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  placement: "right",
                  view: <CreateEditContact contact={contact} />,
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownInvitation
            entityId={contact.id}
            entityType="contact"
            email={contact.user?.email}
          />

          {canDeleteContact && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={deleteContactMutation.isPending}
                variant="destructive"
                onSelect={async () => {
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),

                    onConfirm: async () => {
                      await deleteContactMutation.mutateAsync(contact.id);
                    },
                  });
                }}
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
