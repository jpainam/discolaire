import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { useParams } from "next/navigation";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useAlert } from "@repo/hooks/use-alert";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/v2/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

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
      accessorKey: "ressources",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return <div>{JSON.stringify(policy.resources)}</div>;
      },
    },
    {
      id: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("isRepeating")} />
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
        return <div>{JSON.stringify(row.original.condition)}</div>;
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
        return ActionCell({ student });
      },
    },
  ];
}

function ActionCell({ student }: { student: PolicyAllProcedureOutput }) {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();

  //const unenrollStudentsMutation =
  //   api.enrollment.deleteByStudentIdClassroomId.useMutation();
  const utils = api.useUtils();
  const { openAlert, closeAlert } = useAlert();
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
              console.log("Viewing student", student);
            }}
          >
            <Eye className="h-4 w-4" /> {t("details")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 bg-destructive text-destructive-foreground"
            onSelect={() => {
              openAlert({
                title: t("unenroll"),
                description: t("delete_confirmation"),
                onConfirm: () => {
                  toast.promise(Promise.resolve(), {
                    loading: t("unenrolling"),
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                    success: async () => {
                      await utils.classroom.students.invalidate(params.id);
                      closeAlert();
                      return t("unenrolled_sucessfully");
                    },
                  });
                },
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t("unenroll")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
