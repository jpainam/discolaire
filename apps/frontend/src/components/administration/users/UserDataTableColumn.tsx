import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AvatarState } from "~/components/AvatarState";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";

type User = RouterOutputs["user"]["all"][number];

export function getUserColumns({ t }: { t: TFunction<string, unknown> }) {
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
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
      cell: ({ row }) => (
        <AvatarState
          pos={row.original.name.length}
          avatar={row.original.avatar}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user")} />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Link
            href={`/users/${user.id}`}
            className="hover:text-blue-600 hover:underline"
          >
            {user.username}
          </Link>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const user = row.original;

        return <div className="flex text-muted-foreground">{user.name}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      cell: ({ row }) => (
        <div className="flex text-muted-foreground">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "profile",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("profile")} />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex text-muted-foreground">{t(user.profile)}</div>
        );
      },
    },
    // {
    //   accessorKey: "emailVerified",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("is_email_verified")} />
    //   ),
    //   cell: () => <Switch checked={false} />,
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("createdAt")} />
    //   ),
    //   cell: ({ row }) => {
    //     const user = row.original;
    //     return <span>{user.createdAt.toLocaleDateString()} </span>;
    //   },
    // },
    {
      id: "actions",
      size: 60,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <ActionCell user={row.original} />,
    },
  ] as ColumnDef<User, unknown>[];
}

function ActionCell({ user }: { user: User }) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();

  const canDeleteUser = useCheckPermission("user", PermissionAction.DELETE);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/administration/users/${user.id}`);
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canDeleteUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    // icon: <Trash2 className="size-4 text-destructive" />,
                    // alertDialogTitle: {
                    //   className: "flex items-center gap-2",
                    // },
                    description: t("delete_confirmation"),
                  });

                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteUserMutation.mutate(user.id);
                  }
                }}
                variant="destructive"
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
