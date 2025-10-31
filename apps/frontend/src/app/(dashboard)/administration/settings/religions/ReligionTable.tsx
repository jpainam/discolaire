"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, PlusCircleIcon, Trash2 } from "lucide-react";
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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditReligion } from "./CreateEditReligion";

export function ReligionTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const confirm = useConfirm();

  const { openModal } = useModal();

  const deleteReligion = useMutation(
    trpc.religion.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.religion.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const religionsQuery = useQuery(trpc.religion.all.queryOptions());
  const religions = religionsQuery.data ?? [];
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("religions")}</TableHead>

              <TableHead className="text-right">
                <Button
                  onClick={() => {
                    openModal({
                      title: t("create"),
                      view: <CreateEditReligion />,
                    });
                  }}
                  variant={"default"}
                  className="size-8"
                  size={"icon"}
                >
                  <PlusCircleIcon />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {religions.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState iconClassName="w-[100px] h-auto" />
                </TableCell>
              </TableRow>
            )}
            {religions.map((denom) => {
              return (
                <TableRow key={denom.id}>
                  <TableCell className="py-0">{denom.name}</TableCell>

                  {/* <TableCell className="py-0">
                {dateFormatter.format(new Date(denom.createdAt))}
              </TableCell> */}
                  {/* <TableCell className="py-0">{denom.createdBy.name}</TableCell> */}
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
                                <CreateEditReligion
                                  id={denom.id}
                                  name={denom.name}
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
                              deleteReligion.mutate(denom.id);
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
