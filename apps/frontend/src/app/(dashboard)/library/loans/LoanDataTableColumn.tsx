import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import i18next from "i18next";
import { Pencil, StampIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
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

import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditLoan } from "./CreateEditLoan";

type BookProcedureOutput = RouterOutputs["library"]["borrowBooks"][number];
export function getBorrowBooksColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
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
        <DataTableColumnHeader column={column} title={t("borrow_date")} />
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
      accessorKey: "returned",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("availability")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const book = row.original;
        const today = new Date();
        let content = <></>;
        if (book.expected && book.expected < today) {
          content = (
            <Badge
              variant={"outline"}
              className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            >
              {t("overdue")}
            </Badge>
          );
        } else if (book.returned && book.returned <= today) {
          content = (
            <Badge
              variant={"outline"}
              className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            >
              {t("returned")}
            </Badge>
          );
        } else {
          content = (
            <Badge
              variant={"outline"}
              className="bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            >
              {t("borrowed")}
            </Badge>
          );
        }
        return <div className="text-center">{content}</div>;
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
  const { openSheet } = useSheet();
  const confirm = useConfirm();

  const t = useTranslations();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const bookMutation = useMutation(
    trpc.library.deleteBorrow.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateBookMutation = useMutation(
    trpc.library.updateBorrowedStatus.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
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
            {canUpdateLoan && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      title: t("edit_a_loan"),
                      view: <CreateEditLoan borrow={book} />,
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
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
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
