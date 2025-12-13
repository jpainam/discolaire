"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Receipt, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubscription } from "./CreateEditSubscription";

export function getColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
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
            className="line-clamp-1 hover:text-blue-600 hover:underline"
            href={`/users/${subscription.user.id}/subscriptions`}
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
          <div className="text-muted-foreground">
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
          <div className="text-muted-foreground">
            {subscription.whatsapp == -1
              ? t("unlimited_whatsapp_messages")
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
          <div className="text-muted-foreground">
            {subscription.email != -1
              ? subscription.email
              : t("unlimited_emails")}
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

  const t = useTranslations();

  const canDeleteSubscription = useCheckPermission(
    "subscription",
    PermissionAction.DELETE,
  );
  const canUpdateSubscription = useCheckPermission(
    "subscription",
    PermissionAction.UPDATE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.subscription.count.pathFilter(),
        );
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const router = useRouter();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/users/${subscription.user.id}/subscriptions`);
            }}
          >
            <Receipt />
            {t("details")}
          </DropdownMenuItem>
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
                    toast.loading(t("Processing"), { id: 0 });
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
