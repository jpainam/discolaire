"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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

import { EmptyComponent } from "~/components/EmptyComponent";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditSection } from "./CreateEditSection";

export function SectionTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const sectionsQuery = useQuery(trpc.classroomSection.all.queryOptions());

  const t = useTranslations();
  const data = sectionsQuery.data ?? [];

  const deleteSectionMutation = useMutation(
    trpc.classroomSection.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomSection.all.pathFilter(),
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
          {sectionsQuery.isPending && (
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
          {!sectionsQuery.isPending && data.length === 0 && (
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
                            <CreateEditSection
                              id={cycle.id}
                              name={cycle.name}
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
                      onSelect={async () => {
                        const isConfirmed = await confirm({
                          title: t("delete"),
                          description: t("delete_confirmation"),
                          icon: <Trash2 className="text-destructive" />,
                          alertDialogTitle: {
                            className: "flex items-center gap-2",
                          },
                        });
                        if (isConfirmed) {
                          toast.loading(t("deleting"), { id: 0 });
                          deleteSectionMutation.mutate(cycle.id);
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
