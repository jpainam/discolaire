"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { TermType } from "@repo/db/enums";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCheckPermission } from "~/hooks/use-permission";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/appreciations";

export function StudentGradesheetTable({
  className,
  tableClassName,
}: {
  className?: string;
  tableClassName?: string;
}) {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({ id: params.id }),
  );

  const { data: classroom } = useSuspenseQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );
  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());
  const queryClient = useQueryClient();
  const canUpdateGradesheet = useCheckPermission("gradesheet.update");
  const canDeleteGradesheet = useCheckPermission("gradesheet.delete");
  const deleteGradeMutation = useMutation(
    trpc.grade.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.grades.pathFilter());
        toast.success(t("deleted_successfully", { id: 0 }));
      },
    }),
  );

  const updateGradeMutation = useMutation(
    trpc.grade.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.grades.pathFilter());
        toast.success(t("updated_successfully", { id: 0 }));
      },
    }),
  );

  const onDeleteGradeAction = (gradeId: number) => {
    deleteGradeMutation.mutate(gradeId);
  };
  const updateGradeAction = (
    gradeId: number,
    newGrade: number,
    isAbsent: boolean,
  ) => {
    updateGradeMutation.mutate({
      id: gradeId,
      grade: newGrade,
      isAbsent: isAbsent,
    });
  };

  const t = useTranslations();

  const data = useMemo(() => {
    const vv = new Map<
      number,
      {
        id: number;
        subject: string;
        color: string;
        observation: string;
        grades: {
          grade: number;
          id: number;
          isAbsent: boolean;
          termId: string;
        }[];
      }
    >();

    grades.forEach((grade) => {
      const subjectId = grade.gradeSheet.subjectId;
      if (!subjectId) return;

      let row = vv.get(subjectId);
      if (!row) {
        row = {
          id: subjectId,
          color: grade.gradeSheet.subject.course.color,
          subject: grade.gradeSheet.subject.course.reportName,
          observation: grade.observation ?? "",
          grades: [],
        };
        vv.set(subjectId, row);
      }

      row.grades.push({
        grade: grade.grade,
        id: grade.id,
        termId: grade.gradeSheet.termId,
        isAbsent: grade.isAbsent ?? false,
      });
    });

    return vv;
  }, [grades]);

  if (!classroom) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DollarSign />
          </EmptyMedia>
          <EmptyTitle>Aucune note</EmptyTitle>
          <EmptyDescription>{t("student_not_registered_yet")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className={cn("flex grid grid-cols-1 py-2", className)}>
      <div className={cn("bg-background overflow-hidden", tableClassName)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("subject")}</TableHead>
              {terms
                .filter((t) => t.type == TermType.MONTHLY)
                .map((t) => (
                  <TableHead key={t.id}>{t.name.split(" ")[0]}</TableHead>
                ))}

              <TableHead className="text-center">{t("avg")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {Object.values(data).length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  <EmptyComponent title={t("no_data")} />
                </TableCell>
              </TableRow>
            )} */}
            {Array.from(data).map(([key, row], index) => {
              const avg =
                row.grades.length == 0
                  ? 0
                  : row.grades.reduce((a, b) => a + b.grade, 0) /
                    row.grades.length;

              return (
                <TableRow key={index}>
                  <TableCell className="py-0 font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full"
                        style={{
                          backgroundColor: row.color,
                        }}
                      ></div>
                      <Link
                        className="hover:underline"
                        href={`/classrooms/${classroom.id}/subjects/${key}`}
                      >
                        {row.subject}
                      </Link>
                    </div>
                  </TableCell>
                  {terms
                    .filter((t) => t.type == TermType.MONTHLY)
                    .map((term) => {
                      const g = row.grades.find((x) => x.termId === term.id);
                      return (
                        <Cell
                          key={term.id}
                          gradeId={g?.id}
                          isAbsent={g?.isAbsent}
                          onDeleteGradeAction={onDeleteGradeAction}
                          updateGradeAction={updateGradeAction}
                          grade={g?.grade}
                          canUpdateGradesheet={canUpdateGradesheet}
                          canDeleteGradesheet={canDeleteGradesheet}
                        />
                      );
                    })}
                  <TableCell className="text-muted-foreground text-center">
                    {avg.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center text-right">
                    {getAppreciations(avg)}
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

function Cell({
  grade,
  gradeId,
  isAbsent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateGradeAction,
  canDeleteGradesheet,
  onDeleteGradeAction,
  canUpdateGradesheet,
}: {
  grade?: number;
  gradeId?: number;
  isAbsent?: boolean;
  canUpdateGradesheet: boolean;
  canDeleteGradesheet: boolean;
  updateGradeAction: (
    gradeId: number,
    newGrade: number,
    isAbsent: boolean,
  ) => void;
  onDeleteGradeAction: (gradeId: number) => void;
}) {
  const g = grade ?? 0;
  const gradeText = g > 0 ? g.toFixed(2) : "";
  const t = useTranslations();
  const [newGrade, setNewGrade] = useState<string | null>();
  const [open, setOpen] = useState<boolean>();
  const [isNewAbsent, setIsNewAbsent] = useState<boolean>(isAbsent ?? false);
  if (!canUpdateGradesheet) {
    return (
      <TableCell
        className={cn(
          "text-muted-foreground py-0",
          g >= 18 ? "text-green-500" : "",
          g < 10 ? "text-red-500" : "",
        )}
      >
        {isAbsent ? t("absent") : gradeText}
      </TableCell>
    );
  }
  return (
    <TableCell
      className={cn(
        "text-muted-foreground py-0",
        g >= 18 ? "text-green-500" : "",
        g < 10 ? "text-red-500" : "",
      )}
    >
      {gradeId && gradeText != "" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={"link"}>{gradeText}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <Label>{t("grade")}</Label>
                <Input
                  type="number"
                  defaultValue={gradeText}
                  onChange={(e) => setNewGrade(e.target.value)}
                />
                <div className="flex flex-row items-center justify-end space-x-2">
                  <Checkbox
                    id="isAbsence"
                    checked={isNewAbsent}
                    onCheckedChange={(checked) => setIsNewAbsent(!!checked)}
                  />
                  <Label htmlFor="isAbsence">{t("absent")}</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (!newGrade) {
                      toast.warning("Veuillez saisir une note");
                      return;
                    }
                    toast.warning("Fonctionnalité non active");
                    //updateGradeAction(gradeId, Number(newGrade), isNewAbsent);
                    setOpen(false);
                  }}
                  size={"xs"}
                  variant={"outline"}
                >
                  {t("edit")}
                </Button>

                <Button
                  disabled={!canDeleteGradesheet}
                  onClick={() => {
                    onDeleteGradeAction(gradeId);
                    setOpen(false);
                  }}
                  size={"xs"}
                  variant={"destructive"}
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </TableCell>
  );
}
