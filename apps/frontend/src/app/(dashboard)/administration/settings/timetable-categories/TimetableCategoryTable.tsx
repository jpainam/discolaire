"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { MoreHorizontal, Pencil, PlusCircleIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { CreateEditTimetableCategory } from "./CreateEditTimetableCategory";

export function TimetableCategoryTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const categoryQuery = useQuery(trpc.timetableCategory.all.queryOptions());
  const categories = categoryQuery.data ?? [];
  const { t } = useLocale();
  const confirm = useConfirm();

  const { openModal } = useModal();

  const deleteCategoryMutation = useMutation(
    trpc.timetableCategory.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.timetableCategory.all.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("category")}</TableHead>
              <TableHead className="text-right">
                <Button
                  onClick={() => {
                    openModal({
                      title: t("create"),
                      view: <CreateEditTimetableCategory />,
                    });
                  }}
                  className="size-8"
                  variant={"default"}
                  size={"icon"}
                >
                  <PlusCircleIcon />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState iconClassName="w-[100px] h-auto" />
                </TableCell>
              </TableRow>
            )}
            {categories.map((cat) => {
              return (
                <TableRow key={cat.id}>
                  <TableCell className="py-0">{cat.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-auto" asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            openModal({
                              title: t("edit"),
                              view: (
                                <CreateEditTimetableCategory
                                  id={cat.id}
                                  name={cat.name}
                                />
                              ),
                            });
                          }}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirmed) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteCategoryMutation.mutate(cat.id);
                            }
                          }}
                        >
                          <Trash2 />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
