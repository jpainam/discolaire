"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, PlusCircleIcon, Trash2 } from "lucide-react";
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
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditStaffLevel } from "./CreateEditStaffLevel";

export function StaffLevelTable() {
  const trpc = useTRPC();
  const degreesQuery = useQuery(trpc.degree.all.queryOptions());

  const t = useTranslations();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { openModal } = useModal();
  const deleteDegreeMutation = useMutation(
    trpc.degree.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.degree.all.pathFilter());
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
              <TableHead>{t("staff_level")}</TableHead>
              <TableHead className="text-right">
                {" "}
                <Button
                  onClick={() => {
                    openModal({
                      title: t("create"),

                      view: <CreateEditStaffLevel />,
                    });
                  }}
                  variant={"default"}
                  size={"icon"}
                  className="size-8"
                >
                  <PlusCircleIcon />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {degreesQuery.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}
            {degreesQuery.data?.map((degree) => {
              return (
                <TableRow key={degree.id}>
                  <TableCell className="py-0">{degree.name}</TableCell>
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
                                <CreateEditStaffLevel
                                  id={degree.id}
                                  name={degree.name}
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
                          className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirmed) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteDegreeMutation.mutate(degree.id);
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
