import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Switch } from "@repo/ui/switch";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";

type User = RouterOutputs["user"]["all"][number];

export function getUserColumns({
  t,
  fullDateFormatter,
}: {
  t: TFunction<string, unknown>;
  fullDateFormatter: Intl.DateTimeFormat;
}) {
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
    },
    {
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avatar" />
      ),
      cell: ({ row }) => (
        <Avatar className="flex h-[20px] w-[20px] items-center justify-center rounded">
          <AvatarImage src={row.original.avatar ?? ""} alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      cell: ({ row }) => <div className="flex">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("is_email_verified")} />
      ),
      cell: () => <Switch checked={false} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        return fullDateFormatter.format(new Date(row.getValue("createdAt")));
      },
    },
    {
      id: "actions",

      cell: ({ row }) => <ActionCell user={row.original} />,
    },
  ] as ColumnDef<User, unknown>[];
}

function ActionCell({ user }: { user: User }) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const router = useRouter();
  const canDeleteUser = useCheckPermissions(PermissionAction.DELETE, "user");
  const deleteUserMutation = api.user.delete.useMutation({
    onSettled: () => utils.user.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
            <Eye className="mr-2 h-4 w-4" />
            {t("details")}
          </DropdownMenuItem>
          {canDeleteUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    icon: <Trash2 className="size-4 text-destructive" />,
                    alertDialogTitle: {
                      className: "flex items-center gap-2",
                    },
                    description: t("delete_confirmation"),
                  });

                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteUserMutation.mutate(user.id);
                  }
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
