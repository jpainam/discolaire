import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { Pencil, StampIcon, Trash2 } from "lucide-react";
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditLoan } from "./CreateEditLoan";

type LoanOutput = RouterOutputs["library"]["loans"]["data"][number];

function getBorrowerName(loan: LoanOutput): string {
  if (loan.student) {
    return `${loan.student.firstName ?? ""} ${loan.student.lastName ?? ""}`.trim();
  }
  if (loan.staff) {
    return `${loan.staff.firstName ?? ""} ${loan.staff.lastName ?? ""}`.trim();
  }
  if (loan.contact) {
    return `${loan.contact.firstName ?? ""} ${loan.contact.lastName ?? ""}`.trim();
  }
  return "—";
}

export function useBorrowBooksColumns(): ColumnDef<LoanOutput, unknown>[] {
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
        accessorKey: "borrowed",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("borrow_date")} />
        ),
        cell: ({ row }) => {
          const loan = row.original;
          return (
            <span>
              {loan.borrowed.toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        },
      },
      {
        accessorKey: "book.title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("title")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.book.title}</span>
        ),
      },
      {
        accessorKey: "book.author",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("author")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.book.author}</span>
        ),
      },
      {
        id: "borrower",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("name")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{getBorrowerName(row.original)}</span>
        ),
      },
      {
        accessorKey: "returned",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("availability")} />
        ),
        size: 60,
        cell: ({ row }) => {
          const loan = row.original;
          const today = new Date();
          if (loan.expected && loan.expected < today && !loan.returned) {
            return (
              <div className="text-center">
                <Badge variant={"outline"} className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                  {t("overdue")}
                </Badge>
              </div>
            );
          }
          if (loan.returned && loan.returned <= today) {
            return (
              <div className="text-center">
                <Badge variant={"outline"} className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  {t("returned")}
                </Badge>
              </div>
            );
          }
          return (
            <div className="text-center">
              <Badge variant={"outline"} className="bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                {t("borrowed")}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: function Cell({ row }) {
          return <ActionCells loan={row.original} />;
        },
        size: 48,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [locale, t],
  );
}

function ActionCells({ loan }: { loan: LoanOutput }) {
  const { openModal } = useModal();
  const confirm = useConfirm();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.library.deleteLoan.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateStatusMutation = useMutation(
    trpc.library.updateLoanStatus.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );

  const canUpdateLoan = useCheckPermission("library.update");
  const canDeleteLoan = useCheckPermission("library.delete");

  return (
    <div className="flex justify-end">
      {(canDeleteLoan || canUpdateLoan) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdateLoan && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      className: "sm:max-w-xl",
                      title: t("edit_a_loan"),
                      view: <CreateEditLoan loan={loan} />,
                    });
                  }}
                >
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <StampIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <span>{t("status")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      toast.loading(t("updating"), { id: 0 });
                      void updateStatusMutation.mutate({ id: loan.id, returned: true });
                    }}
                  >
                    <Checkbox checked={loan.returned !== null} />
                    {t("returned")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox checked={loan.expected ? loan.expected < new Date() && !loan.returned : false} />
                    {t("overdue")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      toast.loading(t("updating"), { id: 0 });
                      void updateStatusMutation.mutate({ id: loan.id, returned: false, expected: addDays(new Date(), 7) });
                    }}
                  >
                    <Checkbox checked={loan.returned === null} />
                    {t("borrowed")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            {canDeleteLoan && (
              <DropdownMenuItem
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    onConfirm: async () => {
                      await deleteMutation.mutateAsync(loan.id);
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
