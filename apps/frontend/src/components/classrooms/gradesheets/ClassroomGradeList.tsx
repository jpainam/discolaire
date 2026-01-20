/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  FlagOff,
  MoreHorizontal,
  MoreVertical,
  PlusIcon,
  Search,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { EditStudentGrade } from "~/components/classrooms/gradesheets/grades/EditStudentGrade";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, EditIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";
import { CreateStudentGrade } from "./grades/CreateStudentGrade";

export function ClassroomGradeList({
  grades,
  gradesheet,
  className,
  classroomId,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
  gradesheet: RouterOutputs["gradeSheet"]["get"];
  classroomId: string;
  className?: string;
}) {
  const confirm = useConfirm();
  const trpc = useTRPC();

  const t = useTranslations();

  const { openModal } = useModal();
  const [query, setQuery] = useState("");
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const filtered = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return students.filter((st) => {
      return (
        st.registrationNumber?.toLowerCase().includes(lowerQuery) ||
        st.firstName?.toLowerCase().includes(lowerQuery) ||
        st.lastName?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [students, query]);

  const queryClient = useQueryClient();

  const isClosed = !gradesheet.term.isActive;

  const markGradeAbsent = useMutation(
    trpc.grade.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.gradeSheet.grades.pathFilter(),
        );
        toast.success(t("marked_absent_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canUpdateGradesheet = useCheckPermission("gradesheet.update");

  const canDeleteGradesheet = useCheckPermission("gradesheet.delete");
  const router = useRouter();
  const deleteGradeSheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.gradeSheet.pathFilter());
        await queryClient.invalidateQueries(trpc.grade.pathFilter());
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(routes.classrooms.gradesheets.index(classroomId));
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const locale = useLocale();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <InputGroup className="w-1/2">
          <InputGroupInput
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={"secondary"}
            onClick={() => {
              window.open(
                `/api/pdfs/gradesheets/${gradesheet.id}?format=pdf&classroomId=${classroomId}`,
                "_blank",
              );
            }}
          >
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              window.open(
                `/api/pdfs/gradesheets/${gradesheet.id}?format=csv&classroomId=${classroomId}`,
                "_blank",
              );
            }}
          >
            <XMLIcon />
            {t("xml_export")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />

              {canDeleteGradesheet && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={deleteGradeSheetMutation.isPending || isClosed}
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteGradeSheetMutation.mutate(gradesheet.id);
                      }
                    }}
                    variant="destructive"
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("dateOfBirth")}</TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
              <TableHead className="text-center">{t("grade")}</TableHead>
              <TableHead className="text-center">{t("absent")}</TableHead>
              <TableHead></TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((st, index) => {
              const g = grades.find(
                (g) => g.studentId == st.id && g.gradeSheetId == gradesheet.id,
              );

              return (
                <TableRow key={index}>
                  <TableCell>
                    <UserLink
                      name={getFullName(st)}
                      profile="student"
                      id={st.id}
                      avatar={st.avatar}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {st.dateOfBirth?.toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {st.registrationNumber}
                  </TableCell>

                  {g ? (
                    <TableCell className="text-center">
                      {g.isAbsent ? (
                        <>-</>
                      ) : (
                        <Badge
                          variant={
                            g.grade >= 16
                              ? "success"
                              : g.grade >= 14
                                ? "info"
                                : g.grade >= 10
                                  ? "warning"
                                  : "destructive"
                          }
                          appearance={"outline"}
                        >
                          {g.grade.toFixed(2)}
                        </Badge>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell colSpan={3}>
                      <Badge variant={"destructive"} appearance={"outline"}>
                        Non marqué
                      </Badge>
                    </TableCell>
                  )}
                  {g && (
                    <TableCell className="text-center">
                      <Badge variant={g.isAbsent ? "destructive" : "secondary"}>
                        {g.isAbsent ? t("yes") : t("no")}
                      </Badge>
                    </TableCell>
                  )}
                  {g && (
                    <TableCell>
                      {!g.isAbsent &&
                        getAppreciations(g.grade, gradesheet.scale)}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex justify-end">
                      {canUpdateGradesheet && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon-sm"}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {g && (
                              <DropdownMenuItem
                                disabled={isClosed}
                                onSelect={() => {
                                  const st = g.student;
                                  if (!st.id) {
                                    return;
                                  }
                                  openModal({
                                    title: t("edit"),
                                    description: getFullName(st),
                                    view: (
                                      <EditStudentGrade
                                        gradeId={g.id}
                                        grade={g.grade}
                                        studentId={st.id}
                                      />
                                    ),
                                  });
                                }}
                              >
                                <EditIcon />
                                {t("edit")}
                              </DropdownMenuItem>
                            )}
                            {!g && (
                              <DropdownMenuItem
                                disabled={isClosed}
                                onSelect={() => {
                                  openModal({
                                    title: "Ajouter une note",
                                    description: `Veuillez ajouter une note à ${getFullName(st)}`,
                                    view: (
                                      <CreateStudentGrade
                                        studentId={st.id}
                                        gradeSheetId={gradesheet.id}
                                      />
                                    ),
                                  });
                                }}
                              >
                                <PlusIcon />
                                {t("add")}
                              </DropdownMenuItem>
                            )}

                            {g && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={isClosed}
                                  variant="destructive"
                                  onSelect={async () => {
                                    const isConfirmed = await confirm({
                                      title: t("delete"),
                                      description: t("delete_confirmation"),
                                    });
                                    if (isConfirmed) {
                                      toast.loading(t("deleting"), { id: 0 });
                                      markGradeAbsent.mutate({
                                        id: g.id,
                                        grade: 0,
                                        isAbsent: true,
                                      });
                                    }
                                  }}
                                >
                                  <FlagOff />
                                  {t("mark_absent")}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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
