import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
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
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { getErrorMessage } from "~/lib/handle-error";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { api } from "~/trpc/react";
import { CreateEditBook } from "./CreateEditBook";

type BookProcedureOutput = RouterOutputs["book"]["recentlyUsed"][number];
export function getBookColumns({
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("title")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return <span>{book.title}</span>;
      },
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("author")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return <span className="text-muted-foreground">{book.author}</span>;
      },
    },
    {
      accessorKey: "isbn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Isbn")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return <span className="text-muted-foreground">{book.isbn}</span>;
      },
    },
    {
      accessorKey: "categoryId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("category")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return (
          <span className="text-muted-foreground">{book.category.name}</span>
        );
      },
    },
    {
      accessorKey: "available",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("availability")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="text-center">
            {book.available > 0 ? (
              <Badge
                variant={"outline"}
                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              >
                {t("available")}
              </Badge>
            ) : (
              <Badge
                variant={"outline"}
                className="bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
              >
                {t("unavailable")}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "available",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("copies")} />
      ),
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="text-muted-foreground text-center">
            {book.available}
          </div>
        );
      },
      size: 38,
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
  const { t } = useLocale();
  //const router = useRouter();
  const utils = api.useUtils();

  const bookMutation = api.book.delete.useMutation({
    onSettled: () => utils.book.invalidate(),
  });
  const canUpdateBook = useCheckPermission("library", PermissionAction.UPDATE);
  const canDeleteBook = useCheckPermission("library", PermissionAction.DELETE);

  return (
    <div className="flex justify-end">
      {(canDeleteBook || canUpdateBook) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdateBook && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      description: t("edit_classroom_description"),
                      title: t("edit_a_classroom"),
                      view: <CreateEditBook book={book} />,
                    });
                  }}
                >
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {canDeleteBook && (
              <DropdownMenuItem
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.promise(bookMutation.mutateAsync(book.id), {
                      loading: t("deleting"),
                      success: () => {
                        return t("deleted_successfully");
                      },
                      error: (error) => {
                        return getErrorMessage(error);
                      },
                    });
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
