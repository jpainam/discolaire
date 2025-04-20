"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubscription } from "./CreateEditSubscription";

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<RouterOutputs["subscription"]["all"][number], unknown>[] {
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
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <Link
            className="hover:text-blue-600 line-clamp-1 hover:underline"
            href={`/users/${subscription.user.id}`}
          >
            {subscription.user.name}
          </Link>
        );
      },
    },

    {
      accessorKey: "sms",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("SMS")} />
      ),
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <div>
            {subscription.sms == -1 ? t("unlimited_sms") : subscription.sms}
          </div>
        );
      },
    },
    {
      accessorKey: "whatsapp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Whatsapp")} />
      ),
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <div>
            {subscription.whatsapp == -1
              ? t("unlimited_whatsapp")
              : subscription.whatsapp}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("email")} />
      ),
      cell: ({ row }) => {
        const subscription = row.original;
        return (
          <div>
            {subscription.email != -1
              ? subscription.email
              : t("unlimited_email")}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells subscription={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({
  subscription,
}: {
  subscription: RouterOutputs["subscription"]["all"][number];
}) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();

  const canDeleteSubscription = useCheckPermission(
    "subscription",
    PermissionAction.DELETE
  );
  const canUpdateSubscription = useCheckPermission(
    "subscription",
    PermissionAction.UPDATE
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canUpdateSubscription && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  title: t("edit"),
                  view: <CreateEditSubscription subscription={subscription} />,
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteSubscription && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteSubscription}
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("Processing..."), { id: 0 });
                    deleteSubscriptionMutation.mutate(subscription.id);
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
