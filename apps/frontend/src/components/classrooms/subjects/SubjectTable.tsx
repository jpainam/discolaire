"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { CreateEditSubject } from "./CreateEditSubject";

//type ClassroomSubject = RouterOutputs["classroom"]["subjects"][number];
export function SubjectTable({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const subjectsQuery = api.classroom.subjects.useQuery({ id: classroomId });
  const confirm = useConfirm();
  const canDeleteClassroomSubject = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:subject",
  );
  const canEditClassroomSubject = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom:subject",
  );
  const router = useRouter();
  const utils = api.useUtils();
  const deleteSubjectMutation = api.subject.delete.useMutation({
    onSettled: () => utils.classroom.subjects.invalidate(),
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
    <div className="m-2 rounded-lg border">
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
          {subjectsQuery.isPending && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="grid w-full grid-cols-6 gap-2">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Skeleton key={`subject-table-${index}`} className="h-8" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )}
          {subjects.map((subject, index) => (
            <TableRow key={`subject-${index}`}>
              <TableCell className="py-0">
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
              <TableCell className="py-0">
                <Link
                  className="hover:text-blue-600 hover:underline"
                  href={routes.staffs.details(subject.teacher?.id ?? "#")}
                >
                  {subject.teacher?.lastName} {subject.teacher?.firstName}
                </Link>
              </TableCell>
              <TableCell className="py-0">{subject.coefficient}</TableCell>
              <TableCell className="py-0">
                {subject.subjectGroup?.name}
              </TableCell>
              <TableCell className="py-0">{subject.order}</TableCell>
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
                                <p className="px-2">
                                  {t("edit")}-{t("subject")}
                                </p>
                              ),
                              view: <CreateEditSubject subject={subject} />,
                            });
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
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
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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
  );
}
