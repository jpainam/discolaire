"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import { NoPermission } from "~/components/no-permission";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import {
  AddPermissionToRole,
  CreateEditPermission,
} from "./CreateEditPermission";

type Permission = RouterOutputs["permission"]["all"][number];

export function PermissionDataTableV2() {
  const t = useTranslations();
  const trpc = useTRPC();
  const canReadPermission = useCheckPermission("policy", "read");
  const { data: permissions, isLoading } = useSuspenseQuery(
    trpc.permission.all.queryOptions(),
  );

  const columns = usePermissionColumns();

  const { table } = useDataTableV2({
    data: permissions,
    columns,
    pageSize: 30,
    columnVisibilityKey: "permissions-table-v2",
  });

  const moduleOptions = React.useMemo(() => {
    const names = new Set(
      permissions
        .map((permission) => permission.module.name)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map((moduleName) => ({
        label: moduleName,
        value: moduleName,
      }));
  }, [permissions]);

  const statusOptions = React.useMemo(
    () => [
      { label: t("active"), value: "active" },
      { label: t("inactive"), value: "inactive" },
    ],
    [t],
  );

  if (!canReadPermission) {
    return <NoPermission className="py-8" />;
  }

  return (
    <div className="px-4">
      <DataTableV2
        table={table}
        isLoading={isLoading}
        toolbar={
          <DataTableToolbarV2
            table={table}
            searchPlaceholder="Search permissions..."
            filterFields={[
              {
                id: "module",
                label: "Module",
                options: moduleOptions,
              },
              {
                id: "isActive",
                label: t("status"),
                options: statusOptions,
              },
            ]}
          >
            <DataTableViewOptionsV2 table={table} />
          </DataTableToolbarV2>
        }
      />
    </div>
  );
}

function usePermissionColumns() {
  const t = useTranslations();
  return React.useMemo<ColumnDef<Permission, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("name")} />
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground flex">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "resource",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("code")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[#c76dcd]">
            {row.getValue("resource")}
          </Badge>
        ),
      },
      {
        id: "module",
        accessorFn: (row) => row.module.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Module" />
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground flex">
            {row.original.module.name}
          </div>
        ),
      },
      {
        id: "rolesCount",
        accessorFn: (row) => row._count.permissionRoles,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="justify-center"
            title={t("roles")}
          />
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground flex justify-center">
            {row.original._count.permissionRoles}
          </div>
        ),
      },
      {
        id: "isActive",
        accessorFn: (row) => (row.isActive ? "active" : "inactive"),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("status")} />
        ),
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <Badge variant={isActive ? "default" : "destructive"}>
              {isActive ? t("active") : t("inactive")}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <PermissionActions permission={row.original} />,
      },
    ],
    [t],
  );
}

function PermissionActions({ permission }: { permission: Permission }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const canDeletePermission = useCheckPermission("policy", "delete");
  const canUpdatePermission = useCheckPermission("policy", "update");

  const deletePermissionMutation = useMutation(
    trpc.permission.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  const { openSheet } = useSheet();

  if (!canDeletePermission && !canUpdatePermission) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon-sm"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canUpdatePermission && (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    view: <CreateEditPermission permission={permission} />,
                  });
                }}
              >
                <EditIcon />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  openSheet({
                    title: permission.name,
                    description: `${permission.module.name} - ${permission.resource}`,
                    className: "sm:max-w-2xl",
                    view: <AddPermissionToRole permission={permission} />,
                  });
                }}
              >
                <EditIcon />
                Ajouter au role
              </DropdownMenuItem>
            </>
          )}
          {canDeletePermission && (
            <>
              {canUpdatePermission && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });

                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deletePermissionMutation.mutate(permission.id);
                  }
                }}
                variant="destructive"
              >
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
