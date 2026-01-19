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
import { DeleteIcon, EditIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditModule } from "./CreateEditModule";

type Module = RouterOutputs["module"]["all"][number];

export function ModuleDataTableV2() {
  const t = useTranslations();
  const trpc = useTRPC();
  const canReadModule = useCheckPermission("module", "read");
  const { data: modules, isLoading } = useSuspenseQuery(
    trpc.module.all.queryOptions(),
  );

  const columns = useModuleColumns();

  const { table } = useDataTableV2({
    data: modules,
    columns,
    pageSize: 30,
    columnVisibilityKey: "modules-table-v2",
  });

  const statusOptions = React.useMemo(
    () => [
      { label: t("active"), value: "active" },
      { label: t("inactive"), value: "inactive" },
    ],
    [t],
  );

  if (!canReadModule) {
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
            searchPlaceholder="Search modules..."
            filterFields={[
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

function useModuleColumns() {
  const t = useTranslations();
  return React.useMemo<ColumnDef<Module, unknown>[]>(
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
        accessorKey: "code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("code")} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[#c76dcd]">
            {row.original.code}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("description")} />
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground flex">
            {row.original.description}
          </div>
        ),
      },
      {
        id: "permissionsCount",
        accessorFn: (row) => row._count.permissions,
        header: ({ column }) => (
          <DataTableColumnHeader
            className="justify-center text-center"
            column={column}
            title={t("permissions")}
          />
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground flex justify-center">
            {row.original._count.permissions}
          </div>
        ),
      },
      {
        id: "isActive",
        accessorFn: (row) => (row.isActive ? "active" : "inactive"),
        header: ({ column }) => (
          <DataTableColumnHeader
            className="justify-center"
            column={column}
            title={t("status")}
          />
        ),
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <div className="flex justify-center">
              <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? t("active") : t("inactive")}
              </Badge>
            </div>
          );
        },
      },

      {
        id: "actions",
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <ModuleActions module={row.original} />,
      },
    ],
    [t],
  );
}

function ModuleActions({ module }: { module: Module }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const canDeleteModule = useCheckPermission("module", "delete");
  const canUpdateModule = useCheckPermission("module", "update");
  const { openModal } = useModal();

  const deleteModuleMutation = useMutation(
    trpc.module.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.module.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  if (!canDeleteModule && !canUpdateModule) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canUpdateModule && (
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("Update"),
                  description: module.description,
                  className: "sm:max-w-xl",
                  view: <CreateEditModule module={module} />,
                });
              }}
            >
              <EditIcon />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteModule && (
            <>
              {canUpdateModule && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });

                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteModuleMutation.mutate(module.id);
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
