"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function AssignmentTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const assignmentsQuery = useQuery(
    trpc.assignment.getLatest.queryOptions({ pageSize: 10 }),
  );
  const confirm = useConfirm();

  const t = useTranslations();
  const canDelete = useCheckPermission("assignment", PermissionAction.DELETE);

  const deleteAssignmentMutation = useMutation(
    trpc.assignment.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.assignment.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
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
                <EmptyComponent />
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
                      <Eye className="h-4 w-4" />
                      {t("details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    {canDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-[#FF666618]"
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                              icon: (
                                <Trash2 className="text-destructive h-4 w-4" />
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
                          <Trash2 className="h-4 w-4" />
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
