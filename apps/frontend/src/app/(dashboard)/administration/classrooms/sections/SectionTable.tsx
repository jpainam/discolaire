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
import { CreateEditSection } from "./CreateEditSection";

export function SectionTable() {
  const sectionsQuery = api.classroomSection.all.useQuery();
  const { t } = useLocale();
  const data = sectionsQuery.data ?? [];
  const utils = api.useUtils();
  const deleteSectionMutation = api.classroomSection.delete.useMutation({
    onSettled: () => utils.classroomSection.invalidate(),
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
                            <CreateEditSection
                              id={cycle.id}
                              name={cycle.name}
                            />
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
                          deleteSectionMutation.mutate(cycle.id);
                        }
                      }}
                      className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
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
