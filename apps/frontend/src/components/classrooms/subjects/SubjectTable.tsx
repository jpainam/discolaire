"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { CreateEditSubject } from "./CreateEditSubject";

//type ClassroomSubject = RouterOutputs["classroom"]["subjects"][number];
export function SubjectTable({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const subjectsQuery = api.classroom.subjects.useQuery(classroomId);
  const confirm = useConfirm();
  const canDeleteClassroomSubject = useCheckPermission(
    "subject",
    PermissionAction.DELETE
  );
  const canEditClassroomSubject = useCheckPermission(
    "subject",
    PermissionAction.UPDATE
  );
  const router = useRouter();
  const utils = api.useUtils();
  const deleteSubjectMutation = api.subject.delete.useMutation({
    onSettled: () => utils.classroom.subjects.invalidate(classroomId),
    onSuccess: () => {
      router.refresh();
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (err) => {
      toast.error(err.message, { id: 0 });
    },
  });
  const subjects = subjectsQuery.data ?? [];
  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("course")}</TableHead>
              <TableHead>{t("teacher")}</TableHead>
              <TableHead>{t("coefficient")}</TableHead>
              <TableHead>{t("group")}</TableHead>
              <TableHead>{t("order")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!subjectsQuery.isPending && subjects.length == 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {subjectsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="grid w-full grid-cols-6 gap-2">
                    {Array.from({ length: 30 }).map((_, index) => (
                      <Skeleton
                        key={`subject-table-${index}`}
                        className="h-8"
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {subjects.map((subject, index) => (
              <TableRow key={`subject-${index}`}>
                <TableCell>
                  <Link
                    href={
                      routes.classrooms.subjects(`${subject.classroomId}`) +
                      `/${subject.id}`
                    }
                    className="flex flex-row items-center space-x-1 hover:text-blue-600 hover:underline"
                  >
                    <div
                      className="flex h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: subject.course.color,
                      }}
                    ></div>
                    <div>
                      {subject.course.shortName.toUpperCase()} -{" "}
                      {subject.course.name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.staffs.details(subject.teacher?.id ?? "#")}
                  >
                    {subject.teacher?.lastName} {subject.teacher?.firstName}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subject.coefficient}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subject.subjectGroup?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {subject.order}
                </TableCell>
                <TableCell className="py-0 text-right">
                  {(canEditClassroomSubject || canDeleteClassroomSubject) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEditClassroomSubject && (
                          <DropdownMenuItem
                            onSelect={() => {
                              openSheet({
                                title: (
                                  <>
                                    {t("edit")}-{t("subject")}
                                  </>
                                ),
                                view: <CreateEditSubject subject={subject} />,
                              });
                            }}
                          >
                            <Pencil />
                            {t("edit")}
                          </DropdownMenuItem>
                        )}
                        {canDeleteClassroomSubject && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("delete"),
                                  description: t("delete_confirmation"),
                                  icon: (
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  ),
                                  alertDialogTitle: {
                                    className: "flex items-center gap-2",
                                  },
                                });
                                if (isConfirmed) {
                                  toast.loading(t("deleting"), { id: 0 });
                                  deleteSubjectMutation.mutate(subject.id);
                                }
                              }}
                              variant="destructive"
                              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                            >
                              <Trash2 />
                              {t("delete")}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
