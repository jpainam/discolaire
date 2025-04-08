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
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { useTRPC } from "~/trpc/react";
import { CreateEditClub } from "./CreateEditClub";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlusIcon } from "lucide-react";
import { useConfirm } from "~/providers/confirm-dialog";

export function ClubTable() {
  const trpc = useTRPC();
  const clubsQuery = useQuery(trpc.setting.clubs.queryOptions());
  const clubs = clubsQuery.data ?? [];
  const { t } = useLocale();
  const confirm = useConfirm();

  const queryClient = useQueryClient();
  const { openModal } = useModal();

  const deleteClubMutation = useMutation(
    trpc.setting.deleteClub.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.setting.clubs.pathFilter());
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
              <TableHead>{t("clubs")}</TableHead>
              <TableHead className="text-right">
                <Button
                  onClick={() => {
                    openModal({
                      title: t("create"),
                      view: <CreateEditClub />,
                    });
                  }}
                  className="size-8"
                  variant={"default"}
                  size={"icon"}
                >
                  <CirclePlusIcon />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {clubs.map((club) => {
              return (
                <TableRow key={club.id}>
                  <TableCell className="py-0">{club.name}</TableCell>
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
                                <CreateEditClub id={club.id} name={club.name} />
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
                              icon: <Trash2 className="text-destructive" />,
                              alertDialogTitle: {
                                className: "flex items-center gap-1",
                              },
                            });
                            if (isConfirmed) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteClubMutation.mutate(club.id);
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
