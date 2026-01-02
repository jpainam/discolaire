"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { decode } from "entities";
import {
  ExternalLink,
  FileTextIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { ClassroomSubjectGradeSheet } from "./ClassroomSubjectGradeSheet";
import { ClassroomSubjectTimetable } from "./ClassroomSubjectTimetable";
import { CreateEditSubject } from "./CreateEditSubject";
import { SubjectSessionBoard } from "./SubjectSessionBoard";

export function ClassroomSubjectTable() {
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const trpc = useTRPC();
  const { openSheet } = useSheet();
  const { data: session } = authClient.useSession();
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );

  const { data: gradeSheetCount } = useSuspenseQuery(
    trpc.subject.gradesheetCount.queryOptions({ classroomId: params.id }),
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
  const canCreateGradeSheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

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
  const router = useRouter();

  return (
    <div className="py-2">
      <div className="bg-background overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("course")}</TableHead>
              <TableHead>{t("teacher")}</TableHead>
              <TableHead className="text-center">{t("coeff")}</TableHead>
              <TableHead className="text-center">{t("group")}</TableHead>
              <TableHead className="text-center">{t("order")}</TableHead>

              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length == 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}

            {subjects.map((subject, index) => {
              const gradeCount = gradeSheetCount.find(
                (g) => g.subjectId == subject.id,
              );
              return (
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
                        href={`/classrooms/${params.id}/subjects/${subject.id}`}
                        className="hover:underline"
                      >
                        {subject.course.shortName.toUpperCase()} -{" "}
                        {decode(subject.course.name)}
                      </Link>
                      <div className="flex flex-row items-center gap-4 px-4">
                        <Badge
                          onClick={() => {
                            openSheet({
                              title: subject.course.name,
                              className: "w-full sm:max-w-4xl w-[420px]",
                              description: `${subject.teacher?.prefix} ${getFullName(subject.teacher)}`,
                              view: (
                                <ClassroomSubjectGradeSheet
                                  subjectId={subject.id}
                                />
                              ),
                            });
                          }}
                          className="cursor-pointer"
                          variant={"warning"}
                          appearance={"outline"}
                        >
                          {gradeCount?.count ?? 0} {t("gradesheets")}{" "}
                          <ExternalLink />
                        </Badge>

                        <Badge
                          className="cursor-pointer"
                          onClick={() => {
                            openSheet({
                              title: `Programme ${subject.course.name} `,
                              description: `${subject.teacher?.prefix} ${getFullName(subject.teacher)}`,
                              view: (
                                <div className="h-full w-full overflow-x-auto">
                                  <SubjectSessionBoard
                                    columnClassName="flex h-full w-[300px] flex-1 shrink-0 flex-col  lg:w-[360px]"
                                    className="flex h-full min-w-max gap-3 overflow-hidden px-2 pb-2"
                                    subjectId={subject.id}
                                  />
                                </div>
                              ),
                              className: "min-w-3/4 w-full sm:max-w-5xl w-3/4",
                            });
                          }}
                          appearance={"outline"}
                          variant={"info"}
                        >
                          {subject.programs.length} programmes <ExternalLink />
                        </Badge>

                        <Badge
                          className="cursor-pointer"
                          onClick={() => {
                            openSheet({
                              title: "Emploi du. temps",
                              description: `${subject.course.name} - ${subject.teacher?.prefix} ${subject.teacher?.lastName}`,
                              view: (
                                <ClassroomSubjectTimetable
                                  subjectId={subject.id}
                                />
                              ),
                            });
                          }}
                          variant={"success"}
                          appearance={"outline"}
                        >
                          {subject.timetables.length} {t("timetable")}
                          <ExternalLink />
                        </Badge>
                      </div>
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
                  <TableCell className="text-muted-foreground text-center">
                    {subject.coefficient}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {subject.subjectGroup?.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {subject.order}
                  </TableCell>

                  <TableCell className="py-0 text-right">
                    {(canEditClassroomSubject || canDeleteClassroomSubject) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon-sm"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-38">
                          {canEditClassroomSubject && (
                            <DropdownMenuItem
                              onSelect={() => {
                                const formId = `edit-subject-form-${subject.id}`;
                                openSheet({
                                  title: `${t("edit")}-${t("subject")}`,
                                  view: (
                                    <CreateEditSubject
                                      subject={subject}
                                      formId={formId}
                                    />
                                  ),
                                  formId,
                                });
                              }}
                            >
                              <EditIcon />
                              {t("edit")}
                            </DropdownMenuItem>
                          )}
                          {canCreateGradeSheet && (
                            <DropdownMenuItem
                              onSelect={() => {
                                router.push(
                                  `/classrooms/${params.id}/gradesheets/create?subjectId=${subject.id}`,
                                );
                              }}
                            >
                              <FileTextIcon />
                              Saisir les notes
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
                                <DeleteIcon />
                                {t("delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
