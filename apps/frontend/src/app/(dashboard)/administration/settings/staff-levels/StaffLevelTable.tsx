"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";

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
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";
import { CreateEditStaffLevel } from "./CreateEditStaffLevel";

export function StaffLevelTable() {
  const degreesQuery = api.degree.all.useQuery();
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteDegreeMutation = api.degree.delete.useMutation({
    onSettled: () => utils.degree.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>{t("name")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {degreesQuery.data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={2}>
              <EmptyState />
            </TableCell>
          </TableRow>
        )}
        {degreesQuery.data?.map((degree) => {
          return (
            <TableRow key={degree.id}>
              <TableCell className="py-0">{degree.name}</TableCell>
              <TableCell className="py-0 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        openModal({
                          className: "w-[400px]",
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
                          icon: <Trash2 className="h-5 w-5 text-destructive" />,
                          alertDialogTitle: {
                            className: "flex items-center gap-1",
                          },
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
  );
}
