"use client";

import { LayoutGridIcon, ListIcon, MoreVertical, Trash2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { api, useTRPC } from "~/trpc/react";

export function StudentGradeHeader({
  student,
  classroomId,
}: {
  student: RouterOutputs["student"]["get"];
  classroomId: string;
}) {
  const { t } = useLocale();
  const trpc = useTRPC();
  // const searchParams = useSearchParams();
  const [term] = useQueryState("term", parseAsInteger);
  const [view, setView] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });
  const router = useRouter();
  const studentGradesQuery = useQuery(
    trpc.student.grades.queryOptions({
      id: student.id,
      termId: term ? Number(term) : undefined,
    })
  );

  const queryClient = useQueryClient();
  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE
  );
  const confirm = useConfirm();
  const deleteGradeMutation = useMutation(
    trpc.grade.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        await queryClient.invalidateQueries(trpc.student.grades.pathFilter());
        router.push(`/students/${student.id}/grades`);
      },
    })
  );
  const params = useParams<{ gradeId: string; id: string }>();

  const [studentAvg, setStudentAvg] = useState<number | null>(null);
  const [classroomAvg, setClassroomAvg] = useState<number | null>(null);

  const classroomMinMaxMoyGrades =
    api.classroom.getMinMaxMoyGrades.useQuery(classroomId);

  useEffect(() => {
    let gradeSum = 0;
    let coeffSum = 0;

    if (term) {
      classroomMinMaxMoyGrades.data?.forEach((grade) => {
        if (grade.termId == Number(term)) {
          gradeSum += (grade.avg ?? 0) * (grade.coefficient ?? 0);
          coeffSum += grade.coefficient ?? 0;
        }
      });
      setClassroomAvg(gradeSum / (coeffSum || 1e9));
    } else {
      setClassroomAvg(null);
    }
  }, [classroomMinMaxMoyGrades.data, term]);

  useEffect(() => {
    let gradeSum = 0;
    let coeffSum = 0;
    if (!studentGradesQuery.data) return;
    if (term) {
      studentGradesQuery.data.forEach((grade) => {
        if (grade.gradeSheet.termId == Number(term)) {
          gradeSum += grade.grade * grade.gradeSheet.subject.coefficient;
          coeffSum += grade.gradeSheet.subject.coefficient;
        }
      });
      setStudentAvg(gradeSum / (coeffSum || 1e9));
    } else {
      setStudentAvg(null);
    }
  }, [studentGradesQuery.data, term]);

  const { createQueryString } = useCreateQueryString();

  if (classroomMinMaxMoyGrades.isPending) {
    return (
      <div className="border-b py-2">
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-row items-center gap-2 border-b px-4 py-1 text-secondary-foreground">
        <ListIcon className="hidden md:block h-4 w-4" />
        <Label className="hidden md:block">{t("term")}</Label>
        <TermSelector
          className="w-full md:w-[300px]"
          showAllOption={true}
          onChange={(val) => {
            //void setTerm(Number(val));
            router.push(
              "?" +
                createQueryString({
                  term: val,
                })
            );
          }}
          defaultValue={term ? `${term}` : undefined}
        />

        {studentAvg && (
          <FlatBadge className="hidden md:block" variant={"yellow"}>
            {t("student_general_avg")} : {studentAvg.toFixed(2)}
          </FlatBadge>
        )}

        {classroomAvg && (
          <FlatBadge className="hidden md:block" variant={"blue"}>
            {t("classroom_general_avg")} : {classroomAvg.toFixed(2)}
          </FlatBadge>
        )}
        <div className="ml-auto flex flex-row items-center gap-2">
          <ToggleGroup
            defaultValue={view}
            value={view}
            size={"sm"}
            className="*:data-[slot=toggle-group-item]:px-3 rounded-sm"
            onValueChange={(v) => {
              void setView(v);
            }}
            variant={"outline"}
            type="single"
          >
            <ToggleGroupItem
              value="by_chronological_order"
              aria-label="Toggle by_chronological_order"
            >
              <ListIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="by_subject" aria-label="Toggle by_subject">
              <LayoutGridIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="size-8" variant="outline">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/student/grades/?id=${student.id}&format=pdf`,
                    "_blank"
                  );
                }}
              >
                <PDFIcon /> {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/student/grades/?id=${student.id}&format=csv`,
                    "_blank"
                  );
                }}
              >
                <XMLIcon /> {t("xml_export")}
              </DropdownMenuItem>
              {canDeleteGradesheet && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!params.gradeId}
                    onSelect={async () => {
                      if (!params.gradeId) return;
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteGradeMutation.mutate(Number(params.gradeId));
                      }
                    }}
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
      <div className="md:hidden grid grid-cols-2 gap-2 px-4 pb-2">
        {studentAvg && (
          <FlatBadge variant={"yellow"}>
            {t("student_general_avg")} : {studentAvg.toFixed(2)}
          </FlatBadge>
        )}

        {classroomAvg && (
          <FlatBadge variant={"blue"}>
            {t("classroom_general_avg")} : {classroomAvg.toFixed(2)}
          </FlatBadge>
        )}
      </div>
    </div>
  );
}
