import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import { Badge } from "~/components/ui/badge";
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
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ReservationOutput =
  RouterOutputs["library"]["reservations"]["data"][number];

function getBorrowerName(r: ReservationOutput): string {
  if (r.student)
    return `${r.student.firstName ?? ""} ${r.student.lastName ?? ""}`.trim();
  if (r.staff)
    return `${r.staff.firstName ?? ""} ${r.staff.lastName ?? ""}`.trim();
  if (r.contact)
    return `${r.contact.firstName ?? ""} ${r.contact.lastName ?? ""}`.trim();
  return "—";
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  FULFILLED: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
};

export function useReservationColumns(): ColumnDef<
  ReservationOutput,
  unknown
>[] {
  const locale = useLocale();
  const t = useTranslations();
  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        accessorKey: "reservedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("date")} />
        ),
        cell: ({ row }) => (
          <span>
            {row.original.reservedAt.toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "book.title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("title")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.book.title}
          </span>
        ),
      },
      {
        accessorKey: "book.author",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("author")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.book.author}
          </span>
        ),
      },
      {
        id: "borrower",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("name")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {getBorrowerName(row.original)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("status")} />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="text-center">
              <Badge variant={"outline"} className={STATUS_STYLES[status]}>
                {t(status.toLowerCase())}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: function Cell({ row }) {
          return <ActionCells reservation={row.original} />;
        },
        size: 48,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [locale, t],
  );
}

function ActionCells({ reservation }: { reservation: ReservationOutput }) {
  const confirm = useConfirm();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.library.deleteReservation.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.reservations.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateStatusMutation = useMutation(
    trpc.library.updateReservationStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.reservations.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canUpdate = useCheckPermission("library.update");
  const canDelete = useCheckPermission("library.delete");

  return (
    <div className="flex justify-end">
      {(canDelete || canUpdate) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdate && (
              <>
                {(
                  ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"] as const
                ).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onSelect={() => {
                      toast.loading(t("updating"), { id: 0 });
                      void updateStatusMutation.mutate({
                        id: reservation.id,
                        status: s,
                      });
                    }}
                  >
                    <Checkbox checked={reservation.status === s} />
                    {t(s.toLowerCase())}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {canDelete && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={async () => {
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    onConfirm: async () => {
                      await deleteMutation.mutateAsync(reservation.id);
                    },
                  });
                }}
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
