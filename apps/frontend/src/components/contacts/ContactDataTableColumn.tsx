"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
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
import { AvatarState } from "../AvatarState";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { ContactStudentList } from "./ContactStudentList";
import CreateEditContact from "./CreateEditContact";

type ContactAllProcedureOutput = NonNullable<
  RouterOutputs["contact"]["all"]
>[number];

export function getColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
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
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      accessorKey: "prefix",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("civ")} />
      ),
      cell: ({ row }) => {
        const contact = row.original;
        return <div className="text-muted-foreground">{contact.prefix}</div>;
      },
      size: 32,
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
            className="line-clamp-1 hover:text-blue-600 hover:underline"
            href={routes.contacts.details(v.id)}
          >
            {v.lastName && decode(v.lastName)}
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
            className="text-muted-foreground line-clamp-1 hover:text-blue-600 hover:underline"
            href={routes.contacts.details(v.id)}
          >
            {v.firstName && decode(v.firstName)}
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
        return (
          <div className="text-muted-foreground">
            {row.getValue("phoneNumber1")}
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("address")} />
      ),
      cell: ({ row }) => {
        const contact = row.original;
        return <div className="text-muted-foreground">{contact.address}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell contact={row.original} />,
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
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
        await queryClient.invalidateQueries(trpc.contact.all.pathFilter());
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
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteContactMutation.mutate(contact.id);
                  }
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
