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

import { EmptyComponent } from "~/components/EmptyComponent";
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
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/appreciations";

export function StudentGradesheetTable({ className }: { className?: string }) {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({ id: params.id }),
  );

  const { data: classroom } = useSuspenseQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );
  const queryClient = useQueryClient();
  const canUpdateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.UPDATE,
  );
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
    const vv: Record<
      number,
      {
        id: number;
        subject: string;
        observation: string;
        grades: { grade: number; id: number; isAbsent: boolean }[];
      }
    > = {};

    grades.forEach((grade) => {
      const subjectId = grade.gradeSheet.subjectId;
      if (!subjectId) return;

      vv[subjectId] ??= {
        id: subjectId,
        subject: grade.gradeSheet.subject.course.reportName,
        observation: grade.observation ?? "",
        grades: [],
      };

      vv[subjectId].grades.push({
        grade: grade.grade,
        id: grade.id,
        isAbsent: grade.isAbsent ?? false,
      });
    });

    return Object.values(vv).map((entry) => ({
      subjectId: entry.id,
      subject: entry.subject,
      grade1: entry.grades[0],
      grade2: entry.grades[1],
      grade3: entry.grades[2],
      grade4: entry.grades[3],
      grade5: entry.grades[4],
      grade6: entry.grades[5],
      observation: entry.observation,
    }));
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
    <div className={cn("py-2", className)}>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("subject")}</TableHead>
              <TableHead>Seq 1</TableHead>
              <TableHead>Seq 2</TableHead>
              <TableHead>Seq 3</TableHead>
              <TableHead>Seq 4</TableHead>
              <TableHead>Seq 5</TableHead>
              <TableHead>Seq 6</TableHead>
              <TableHead className="text-center">{t("avg")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  <EmptyComponent title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
            {data.map((row, index) => {
              const totalGrades =
                (row.grade1?.grade ?? 0) +
                (row.grade2?.grade ?? 0) +
                (row.grade3?.grade ?? 0) +
                (row.grade4?.grade ?? 0) +
                (row.grade5?.grade ?? 0) +
                (row.grade6?.grade ?? 0);

              const gradeCount =
                (row.grade1?.isAbsent ? 0 : 1) +
                (row.grade2?.isAbsent ? 0 : 1) +
                (row.grade3?.isAbsent ? 0 : 1) +
                (row.grade4?.isAbsent ? 0 : 1) +
                (row.grade5?.isAbsent ? 0 : 1) +
                (row.grade6?.isAbsent ? 0 : 1);

              const avg = gradeCount > 0 ? totalGrades / gradeCount : 0;
              const avgText = avg > 0 ? avg.toFixed(2) : "";

              return (
                <TableRow key={index}>
                  <TableCell className="py-0 font-medium">
                    <Link
                      className="hover:underline"
                      href={`/classrooms/${classroom.id}/subjects/${row.subjectId}`}
                    >
                      {row.subject}
                    </Link>
                  </TableCell>
                  <Cell
                    gradeId={row.grade1?.id}
                    isAbsent={row.grade1?.isAbsent}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade1?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <Cell
                    gradeId={row.grade2?.id}
                    isAbsent={row.grade2?.isAbsent}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade2?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <Cell
                    gradeId={row.grade3?.id}
                    isAbsent={row.grade3?.isAbsent}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade3?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <Cell
                    gradeId={row.grade4?.id}
                    isAbsent={row.grade4?.isAbsent}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade4?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <Cell
                    gradeId={row.grade5?.id}
                    isAbsent={row.grade5?.isAbsent}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade5?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <Cell
                    gradeId={row.grade6?.id}
                    onDeleteGradeAction={onDeleteGradeAction}
                    updateGradeAction={updateGradeAction}
                    grade={row.grade6?.grade}
                    canUpdateGradesheet={canUpdateGradesheet}
                  />
                  <TableCell className="text-muted-foreground text-center">
                    {avgText}
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
  updateGradeAction,
  onDeleteGradeAction,
  canUpdateGradesheet,
}: {
  grade?: number;
  gradeId?: number;
  isAbsent?: boolean;
  canUpdateGradesheet: boolean;
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
      {gradeId && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size={"sm"} variant={"link"}>
              {gradeText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-full flex flex-col gap-2">
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
              <Button
                onClick={() => {
                  if (!newGrade) {
                    toast.warning("Veuillez saisir une note");
                    return;
                  }
                  updateGradeAction(gradeId, Number(newGrade), isNewAbsent);
                  setOpen(false);
                }}
                size={"sm"}
                variant={"outline"}
              >
                {t("edit")}
              </Button>

              <Button
                onClick={() => {
                  onDeleteGradeAction(gradeId);
                  setOpen(false);
                }}
                size={"sm"}
                variant={"destructive"}
              >
                {t("delete")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </TableCell>
  );
}
