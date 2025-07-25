/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
import { FlagOff, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { EditGradeStudent } from "~/components/classrooms/gradesheets/grades/EditGradeStudent";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/appreciations";

export function ClassroomGradeList({
  grades,
  gradesheet,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
  gradesheet: RouterOutputs["gradeSheet"]["get"];
}) {
  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-green-600 bg-green-50";
    if (grade >= 14) return "text-blue-600 bg-blue-50";
    if (grade >= 10) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const confirm = useConfirm();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] =
    useState<RouterOutputs["gradeSheet"]["grades"]>(grades);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setFiltered(grades);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filteredGrades = grades.filter((g) => {
      const student = g.student;
      return (
        student.registrationNumber?.toLowerCase().includes(lowerQuery) ||
        student.firstName?.toLowerCase().includes(lowerQuery) ||
        student.lastName?.toLowerCase().includes(lowerQuery)
      );
    });
    setFiltered(filteredGrades);
  }, [grades, query]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isClosed = gradesheet.term.endDate < new Date();

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
  const canUpdateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );
  const router = useRouter();
  const deleteGradeSheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.gradeSheet.pathFilter());
        await queryClient.invalidateQueries(trpc.grade.pathFilter());
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(routes.classrooms.gradesheets.index(params.id));
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full md:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder={t("search") + "..."}
            className="pl-8"
            //value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              window.open(
                `/api/pdfs/gradesheets/${gradesheet.id}?format=pdf&classroomId=${params.id}`,
                "_blank",
              );
            }}
          >
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => {
              window.open(
                `/api/pdfs/gradesheets/${gradesheet.id}?format=csv&classroomId=${params.id}`,
                "_blank",
              );
            }}
          >
            <XMLIcon />
            {t("xml_export")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="size-8">
                <MoreVertical className="size-4" />
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
                    <Trash2 />
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
              <TableHead className="w-16"></TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
              <TableHead>{t("lastName")}</TableHead>
              <TableHead>{t("firstName")}</TableHead>
              <TableHead className="text-center">{t("grade")}</TableHead>
              <TableHead className="text-center">{t("absent")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((g, index) => (
              <TableRow key={index}>
                <TableCell>
                  <AvatarState
                    avatar={g.student.user?.avatar}
                    pos={g.student.firstName?.length}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {g.student.registrationNumber}
                </TableCell>

                <TableCell className="font-medium">
                  <Link
                    className="hover:underline"
                    href={`/students/${g.student.id}`}
                  >
                    {decode(g.student.lastName ?? "")}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    className="hover:underline"
                    href={`/students/${g.student.id}`}
                  >
                    {decode(g.student.firstName ?? "")}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {g.isAbsent ? (
                    <>-</>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`${getGradeColor(g.grade)} border-0`}
                    >
                      {g.grade.toFixed(2)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={g.isAbsent ? "destructive" : "secondary"}>
                    {g.isAbsent ? t("yes") : t("no")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {!g.isAbsent && (
                    <Badge
                      variant={
                        g.grade < 10
                          ? "destructive"
                          : g.grade >= 14
                            ? "secondary"
                            : "default"
                      }
                    >
                      {getAppreciations(g.grade, gradesheet.scale)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    {canUpdateGradesheet && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label="Open menu"
                            variant="ghost"
                            className="data-[state=open]:bg-muted flex size-8 p-0"
                          >
                            <DotsHorizontalIcon
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={isClosed}
                            onSelect={() => {
                              const st = g.student;
                              if (!st.id) {
                                return;
                              }
                              openModal({
                                title: t("edit"),
                                description: t("edit_grade_description", {
                                  name: `${st.lastName} ${st.firstName}`,
                                }),

                                view: (
                                  <EditGradeStudent
                                    gradeId={g.id}
                                    grade={g.grade}
                                    studentId={st.id}
                                  />
                                ),
                              });
                            }}
                          >
                            <Pencil />
                            {t("edit")}
                          </DropdownMenuItem>
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
                            <FlagOff className="size-4" />
                            {t("mark_absent")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
