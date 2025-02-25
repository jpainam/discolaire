"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";

export function AssignmentCategoryTable() {
  const { t } = useLocale();
  const categoriesQuery = api.assignment.categories.useQuery();
  const utils = api.useUtils();
  const deleteCategoryMutation = api.assignment.deleteCategory.useMutation({
    onSettled: () => utils.assignment.categories.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesQuery.data?.length == 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <EmptyState className="my-8" />
              </TableCell>
            </TableRow>
          )}
          {categoriesQuery.data?.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="py-0">{category.name}</TableCell>
              <TableCell className="py-0 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={deleteCategoryMutation.isPending}
                      onSelect={async () => {
                        const isConfirmed = await confirm({
                          title: t("delete"),
                          description: t("delete_confirmation"),
                        });
                        if (isConfirmed) {
                          toast.loading(t("deleting"), { id: 0 });
                          deleteCategoryMutation.mutate(category.id);
                        }
                      }}
                      className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
