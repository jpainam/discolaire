"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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

import { authClient } from "~/auth/client";
import { EmptyState } from "~/components/EmptyState";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateEditSubject } from "./CreateEditSubject";

export function SubjectTable() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const trpc = useTRPC();
  const { openSheet } = useSheet();
  const { data: session } = authClient.useSession();
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );
  const confirm = useConfirm();
  const canDeleteClassroomSubject = useCheckPermission(
    "subject",
    PermissionAction.DELETE,
  );
  const canEditClassroomSubject = useCheckPermission(
    "subject",
    PermissionAction.UPDATE,
  );
  const queryClient = useQueryClient();

  const deleteSubjectMutation = useMutation(
    trpc.subject.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("course")}</TableHead>
              <TableHead>{t("teacher")}</TableHead>
              <TableHead>{t("coeff")}</TableHead>
              <TableHead>{t("group")}</TableHead>
              <TableHead>{t("order")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length == 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}

            {subjects.map((subject, index) => (
              <TableRow key={`subject-${index}`}>
                <TableCell>
                  <div className="flex flex-row items-center space-x-1">
                    <div
                      className="flex h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: subject.course.color,
                      }}
                    ></div>
                    <Link
                      href={`/classrooms/${params.id}/programs/${subject.id}`}
                      className="hover:text-accent hover:underline"
                    >
                      {subject.course.shortName.toUpperCase()} -{" "}
                      {subject.course.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {session?.user.profile == "staff" ? (
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={routes.staffs.details(subject.teacher?.id ?? "#")}
                    >
                      {subject.teacher?.prefix} {getFullName(subject.teacher)}
                    </Link>
                  ) : (
                    <span>
                      {subject.teacher?.prefix} {getFullName(subject.teacher)}
                    </span>
                  )}
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
                                    <Trash2 className="text-destructive h-4 w-4" />
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
