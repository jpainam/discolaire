"use client";

import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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
import { CreateEditGradeAppreciation } from "./CreateEditGradeAppreciation";

export function GradeAppreciationTable() {
  const { openModal } = useModal();
  const gradeAppreciationsQuery = api.gradeAppreciation.all.useQuery();
  const utils = api.useUtils();
  const { t } = useLocale();
  const deleteAppreciation = api.gradeAppreciation.delete.useMutation({
    onSettled: () => {
      void utils.gradeAppreciation.invalidate();
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center border-b bg-muted/50 px-2 pb-1 pt-0">
        <CardTitle>{t("appreciations")}</CardTitle>
        <div className="ml-auto">
          <Button
            onClick={() => {
              openModal({
                className: "w-[500px]",
                title: t("add_appreciation"),
                view: <CreateEditGradeAppreciation />,
              });
            }}
            size={"sm"}
            variant={"default"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("min_grade")}</TableHead>
              <TableHead>{t("max_grade")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradeAppreciationsQuery.isPending && (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {!gradeAppreciationsQuery.isPending &&
              gradeAppreciationsQuery.data?.length == 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <EmptyState title={t("no_data")} className="py-8" />
                  </TableCell>
                </TableRow>
              )}
            {gradeAppreciationsQuery.data?.map((gradeOption, index) => {
              return (
                <TableRow key={`gradeOption-${index}`}>
                  <TableCell className="py-0">{gradeOption.minGrade}</TableCell>
                  <TableCell className="py-0">{gradeOption.maxGrade}</TableCell>
                  <TableCell className="py-0">
                    {gradeOption.appreciation}
                  </TableCell>
                  <TableCell className="py-0 text-right">
                    <div className="flex flex-row items-center justify-end gap-2">
                      <Button
                        onClick={() => {
                          openModal({
                            className: "w-[500px]",
                            title: t("add_appreciation"),
                            view: (
                              <CreateEditGradeAppreciation
                                gradeAppreciation={gradeOption}
                              />
                            ),
                          });
                        }}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={async () => {
                          const isConfirm = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: (
                              <Trash2 className="h-6 w-6 text-destructive" />
                            ),
                            alertDialogTitle: {
                              className: "flex items-center gap-2",
                            },
                          });
                          if (isConfirm) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteAppreciation.mutate(gradeOption.id);
                          }
                        }}
                        size={"icon"}
                        variant={"ghost"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
