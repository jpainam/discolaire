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
import { CreateEditCycle } from "./CreateEditCycle";

export function CycleTable() {
  const trpc = useTRPC();
  const cyclesQuery = useQuery(trpc.classroomCycle.all.queryOptions());

  const t = useTranslations();
  const data = cyclesQuery.data ?? [];

  const queryClient = useQueryClient();

  const deleteCycleMutation = useMutation(
    trpc.classroomCycle.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomCycle.all.pathFilter(),
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
          {cyclesQuery.isPending && (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`cycle-${index}`}>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          {!cyclesQuery.isPending && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
          {data.map((cycle) => (
            <TableRow key={cycle.id}>
              <TableCell>{cycle.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => {
                        openModal({
                          className: "w-96",
                          title: t("edit"),
                          view: (
                            <CreateEditCycle id={cycle.id} name={cycle.name} />
                          ),
                        });
                      }}
                    >
                      <Pencil />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={async () => {
                        await confirm({
                          title: t("delete"),
                          description: t("delete_confirmation"),
                          icon: <Trash2 className="text-destructive" />,
                          alertDialogTitle: {
                            className: "flex items-center gap-2",
                          },

                          onConfirm: async () => {
                            await deleteCycleMutation.mutateAsync(cycle.id);
                          },
                        });
                      }}
                      variant="destructive"
                      className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                    >
                      <Trash2 /> {t("delete")}
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
