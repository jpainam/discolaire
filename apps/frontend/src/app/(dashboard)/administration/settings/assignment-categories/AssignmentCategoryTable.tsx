"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function AssignmentCategoryTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery(trpc.assignment.categories.queryOptions());

  const deleteCategoryMutation = useMutation(
    trpc.assignment.deleteCategory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.assignment.categories.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
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
                <EmptyComponent />
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
                      <Pencil />
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
                      variant="destructive"
                      className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                    >
                      <Trash2 />
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
