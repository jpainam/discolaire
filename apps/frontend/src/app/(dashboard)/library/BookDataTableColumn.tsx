import { Checkbox } from "@repo/ui/components/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@repo/ui/components/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { RouterOutputs } from "@repo/api";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "~/hooks/use-router";
import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";
import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { getErrorMessage } from "~/lib/handle-error";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { api } from "~/trpc/react";

type BookProcedureOutput = RouterOutputs["book"]["lastBorrowed"][number];
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
        return (
          <span>{book.title}</span>>
        );
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells classroom={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}




function ActionCells({ classroom }: { classroom: BookProcedureOutput }) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const router = useRouter();
  const utils = api.useUtils();
  const canDeleteClassroom = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:details"
  );
  const canUpdateClassroom = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom:details"
  );
  const classroomMutation = api.classroom.delete.useMutation({
    onSettled: () => utils.classroom.invalidate(),
  });

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={() => {
              router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <Eye className="mr-2 size-4" />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateClassroom && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  description: t("edit_classroom_description"),
                  title: t("edit_a_classroom"),
                  view: <CreateEditClassroom classroom={classroom} />,
                });
              }}
            >
              <Pencil className="mr-2 size-4" />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteClassroom && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteClassroom}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.promise(classroomMutation.mutateAsync(classroom.id), {
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
                <Trash2 className="mr-2 size-4" />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
