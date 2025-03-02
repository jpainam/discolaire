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

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { CreateEditCourse } from "./CreateEditCourse";

export function CourseTable() {
  const { t } = useLocale();
  const coursesQuery = api.course.all.useQuery();
  const confirm = useConfirm();
  const router = useRouter();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteCourseMutation = api.course.delete.useMutation({
    onSettled: () => utils.course.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
                            className: "w-[400px]",
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
                            icon: (
                              <Trash2 className="h-6 w-6 text-destructive" />
                            ),
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
