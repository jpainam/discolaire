import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { addDays } from "date-fns";
import type { TFunction } from "i18next";
import i18next from "i18next";
import { StampIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type BookProcedureOutput = RouterOutputs["library"]["borrowBooks"][number];
export function getReservationColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<BookProcedureOutput, unknown>[] {
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
      accessorKey: "borrowed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("date")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return (
          <span>
            {book.borrowed.toLocaleDateString(i18next.language, {
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
      cell: ({ row }) => {
        const book = row.original;
        return <span className="text-muted-foreground">{book.book.title}</span>;
      },
    },
    {
      accessorKey: "book.author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("author")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return (
          <span className="text-muted-foreground">{book.book.author}</span>
        );
      },
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return <span className="text-muted-foreground">{book.user.name}</span>;
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells book={row.original} />;
      },
      size: 48,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({ book }: { book: BookProcedureOutput }) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const bookMutation = useMutation(
    trpc.library.deleteBorrow.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter()
        );
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const updateBookMutation = useMutation(
    trpc.library.updateBorrowedStatus.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter()
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
    })
  );

  const canUpdateLoan = useCheckPermission("library", PermissionAction.UPDATE);
  const canDeleteLoan = useCheckPermission("library", PermissionAction.DELETE);

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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <StampIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{t("status")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      toast.loading(t("updating"), { id: 0 });
                      void updateBookMutation.mutate({
                        id: book.id,
                        returned: true,
                      });
                    }}
                  >
                    <Checkbox checked={book.returned !== null} />
                    {t("returned")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox
                      checked={
                        book.expected ? book.expected < new Date() : false
                      }
                    />
                    {t("overdue")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      toast.loading(t("updating"), { id: 0 });
                      void updateBookMutation.mutate({
                        id: book.id,
                        returned: false,
                        expected: addDays(new Date(), 7),
                      });
                    }}
                  >
                    <Checkbox checked={book.returned === null} />
                    {t("borrowed")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            {canDeleteLoan && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    void bookMutation.mutate(book.id);
                  }
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
