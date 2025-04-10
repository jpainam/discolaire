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
import { CreateEditSport } from "./CreateEditSport";

export function SportTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const sportsQuery = useQuery(trpc.setting.sports.queryOptions());
  const sports = sportsQuery.data ?? [];
  const { t } = useLocale();
  const confirm = useConfirm();

  const { openModal } = useModal();

  const deleteSportMutation = useMutation(
    trpc.setting.deleteSport.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.setting.sports.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("sports")}</TableHead>
              <TableHead className="text-right">
                <Button
                  onClick={() => {
                    openModal({
                      title: t("create"),
                      view: <CreateEditSport />,
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
            {sports.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState iconClassName="w-[100px] h-auto" />
                </TableCell>
              </TableRow>
            )}
            {sports.map((sport) => {
              return (
                <TableRow key={sport.id}>
                  <TableCell className="py-0">{sport.name}</TableCell>
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
                                <CreateEditSport
                                  id={sport.id}
                                  name={sport.name}
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
                              deleteSportMutation.mutate(sport.id);
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
