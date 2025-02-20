"use client";

import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/components/button";
import { useConfirm } from "@repo/ui/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";

export function AssignmentTable() {
  const assignmentsQuery = api.assignment.getLatest.useQuery({ pageSize: 10 });
  const confirm = useConfirm();
  const { t } = useLocale();
  const canDelete = useCheckPermissions(PermissionAction.DELETE, "assignment");
  const utils = api.useUtils();
  const deleteAssignmentMutation = api.assignment.delete.useMutation({
    onSettled: async () => {
      await utils.assignment.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const assignments = assignmentsQuery.data ?? [];
  return (
    <div className="overflow-hidden border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("due_date")}</TableHead>
            <TableHead>{t("subject")}</TableHead>
            <TableHead>{t("teacher")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignmentsQuery.isPending && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="grid grid-cols-5 gap-2 py-2">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )}
          {!assignmentsQuery.isPending && assignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState className="py-8" />
              </TableCell>
            </TableRow>
          )}
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.title}</TableCell>
              <TableCell>{assignment.category.name}</TableCell>
              <TableCell>{format(assignment.dueDate, "PPP")}</TableCell>
              <TableCell>{assignment.subject.course.name}</TableCell>
              <TableCell>{assignment.subject.teacher?.lastName}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    {canDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
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
                              deleteAssignmentMutation.mutate(assignment.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </>
                    )}
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
