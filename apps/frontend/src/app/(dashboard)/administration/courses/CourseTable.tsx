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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { EmptyState } from "~/components/EmptyState";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { CreateEditCourse } from "./CreateEditCourse";

export function CourseTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const coursesQuery = useQuery(trpc.course.all.queryOptions());
  const confirm = useConfirm();

  const { openModal } = useModal();

  const queryClient = useQueryClient();

  const deleteCourseMutation = useMutation(
    trpc.course.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.course.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("shortName")}</TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("reportName")}</TableHead>
            <TableHead>{t("is_active")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coursesQuery.isPending && (
            <TableRow>
              <TableCell colSpan={5}>
                <DataTableSkeleton
                  rowCount={8}
                  columnCount={5}
                  withPagination={false}
                  showViewOptions={false}
                />
              </TableCell>
            </TableRow>
          )}
          {coursesQuery.data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {coursesQuery.data?.map((course) => {
            return (
              <TableRow key={course.id}>
                <TableCell className="py-0">{course.shortName}</TableCell>
                <TableCell className="py-0">{course.name}</TableCell>
                <TableCell className="py-0">{course.reportName}</TableCell>
                <TableCell className="py-0">
                  <FlatBadge variant={course.isActive ? "green" : "red"}>
                    {course.isActive ? t("yes") : t("no")}
                  </FlatBadge>
                </TableCell>
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
                            title: t("edit"),
                            view: <CreateEditCourse course={course} />,
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
                            deleteCourseMutation.mutate(course.id);
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
  );
}
