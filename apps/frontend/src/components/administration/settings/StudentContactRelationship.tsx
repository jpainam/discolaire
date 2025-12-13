"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlusIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
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
import { CreateEditRelationship } from "./CreateEditRelationship";

export function StudentContactRelationship() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const relationshipsQuery = useQuery(
    trpc.studentContact.relationships.queryOptions(),
  );

  const t = useTranslations();

  const deleteRelationship = useMutation(
    trpc.studentContact.deleteRelationship.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studentContact.relationships.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  const confirm = useConfirm();
  const data = relationshipsQuery.data ?? [];
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("parent_relationships")}</TableHead>
              <TableHead className="text-right">
                <Button
                  onClick={() => {
                    openModal({
                      title: t("add_relationship"),
                      view: <CreateEditRelationship />,
                    });
                  }}
                  className="size-8"
                  //variant={"ghost"}
                  size={"icon"}
                >
                  <CirclePlusIcon />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationshipsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} className="h-8" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data.map((relationship, index) => {
              return (
                <TableRow key={`${relationship.id}-${index}`}>
                  <TableCell className="py-0">{relationship.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="ml-auto">
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            openModal({
                              title: t("edit_relationship"),
                              view: (
                                <CreateEditRelationship
                                  id={relationship.id}
                                  name={relationship.name}
                                />
                              ),
                            });
                          }}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={async () => {
                            const isConfirm = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirm) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteRelationship.mutate(relationship.id);
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
