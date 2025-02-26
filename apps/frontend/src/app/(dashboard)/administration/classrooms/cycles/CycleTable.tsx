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
import { Skeleton } from "@repo/ui/components/skeleton";
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

import { api } from "~/trpc/react";
import { CreateEditCycle } from "./CreateEditCycle";

export function CycleTable() {
  const cyclesQuery = api.classroomCycle.all.useQuery();
  const { t } = useLocale();
  const data = cyclesQuery.data ?? [];
  const utils = api.useUtils();
  const deleteCycleMutation = api.classroomCycle.delete.useMutation({
    onSettled: () => utils.classroomCycle.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
                <EmptyState />
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
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={async () => {
                        const isConfirmed = await confirm({
                          title: t("delete"),
                          description: t("delete_confirmation"),
                          icon: <Trash2 className="h-6 w-6 text-destructive" />,
                          alertDialogTitle: {
                            className: "flex items-center gap-2",
                          },
                        });
                        if (isConfirmed) {
                          toast.loading(t("deleting"), { id: 0 });
                          deleteCycleMutation.mutate(cycle.id);
                        }
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
