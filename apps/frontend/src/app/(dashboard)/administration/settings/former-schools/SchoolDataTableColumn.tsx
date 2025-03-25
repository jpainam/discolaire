import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { decode } from "entities";
import { api } from "~/trpc/react";
import { CreateEditSchool } from "./CreateEditSchool";

type FormerSchool = RouterOutputs["formerSchool"]["all"][number];

export function getSchoolColumns({ t }: { t: TFunction<string, unknown> }) {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => (
        <div className="flex">{decode(row.getValue("name"))}</div>
      ),
    },

    {
      id: "actions",

      cell: ({ row }) => <ActionCell school={row.original} />,
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ] as ColumnDef<FormerSchool, unknown>[];
}

function ActionCell({ school }: { school: FormerSchool }) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const { openModal } = useModal();

  const deleteSchoolMutation = api.user.delete.useMutation({
    onSettled: () => utils.formerSchool.invalidate(),
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
              openModal({
                title: t("edit"),
                view: <CreateEditSchool name={school.name} id={school.id} />,
              });
            }}
          >
            <Pencil />
            {t("edit")}
          </DropdownMenuItem>
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
                deleteSchoolMutation.mutate(school.id);
              }
            }}
            className="text-destructive"
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
