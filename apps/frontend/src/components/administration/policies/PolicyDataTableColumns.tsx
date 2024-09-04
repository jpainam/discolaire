import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableColumnHeader } from "@repo/ui/data-table/v2/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { api } from "~/trpc/react";
import { CreateEditPolicy } from "./CreateEditPolicy";

type PolicyAllProcedureOutput = NonNullable<
  RouterOutputs["policy"]["all"]
>[number];

export function fetchPolicyColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<PolicyAllProcedureOutput>[] {
  // const dateFormater = Intl.DateTimeFormat(i18next.language, {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return <div>{policy.name}</div>;
      },
    },
    {
      accessorKey: "effect",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("effect")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return <div>{policy.effect}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("actions")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return <div>{JSON.stringify(policy.actions)}</div>;
      },
    },
    {
      accessorKey: "resources",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("resources")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return <div>{JSON.stringify(policy.resources)}</div>;
      },
    },
    {
      id: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("isActive")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        const v = policy.isActive ? t("yes") : t("no");
        return (
          <FlatBadge variant={policy.isActive ? "red" : "gray"}>{v}</FlatBadge>
        );
      },
    },
    {
      id: "condition",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("condition")} />
      ),
      cell: ({ row }) => {
        const condition = row.original.condition;
        return <div>{condition ? JSON.stringify(condition) : ""}</div>;
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const policy = row.original;
        return ActionCell({ policy });
      },
    },
  ];
}

function ActionCell({ policy }: { policy: PolicyAllProcedureOutput }) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deletePolicyMutation = api.policy.delete.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();
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
            className="flex items-center gap-2"
            onSelect={() => {
              openModal({
                title: t("edit") + " - " + t("policy"),
                view: <CreateEditPolicy policy={policy} />,
              });
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 bg-destructive text-destructive-foreground"
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                confirmText: t("delete_confirmation"),
              });
              if (isConfirmed) {
                deletePolicyMutation.mutate(policy.id);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
