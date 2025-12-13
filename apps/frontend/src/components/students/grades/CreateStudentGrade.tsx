"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function CreateStudentGrade({
  studentId,
  classroomId,
}: {
  studentId: string;
  classroomId: string;
}) {
  const [termId, setTermId] = useState<string | null>();
  const [subjectId, setSubjectId] = useState<string | null>();
  const [gradeSheetId, setGradeSheetId] = useState<string | null>();
  const [grade, setGrade] = useState<string | null>();
  const t = useTranslations();
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createStudentGradeMutation = useMutation(
    trpc.grade.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.grades.pathFilter());
        toast.success(t("created_successfully", { id: 0 }));
        closeModal();
      },
    }),
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector onChange={(val) => setTermId(val)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("subjects")}</Label>
        <SubjectSelector
          classroomId={classroomId}
          onChange={(val) => setSubjectId(val)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Fiche de note</Label>
        {termId && subjectId ? (
          <SelectGradeSheet
            onChangeAction={(val) => setGradeSheetId(val)}
            termId={termId}
            subjectId={Number(subjectId)}
          />
        ) : (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Fiche de note"} />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("grade")}</Label>
        <Input type="number" onChange={(e) => setGrade(e.target.value)} />
      </div>
      <div className="col-span-full flex flex-row items-center justify-end gap-2">
        <Button
          type="button"
          onClick={() => {
            closeModal();
          }}
          size={"sm"}
          variant={"secondary"}
        >
          {t("cancel")}
        </Button>
        <Button
          isLoading={createStudentGradeMutation.isPending}
          onClick={() => {
            if (!grade || !gradeSheetId) {
              toast.warning("Choisir une fiche existente et saisir la note");
              return;
            }
            createStudentGradeMutation.mutate({
              studentId: studentId,
              grade: grade,
              gradeSheetId: gradeSheetId,
            });
          }}
          size={"sm"}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
// import {ViewTransition} from 'react';
function SelectGradeSheet({
  subjectId,
  termId,
  onChangeAction,
}: {
  subjectId: number;
  termId: string;
  onChangeAction: (val: string) => void;
}) {
  const trpc = useTRPC();
  const gradeSheetQuery = useQuery(
    trpc.gradeSheet.all.queryOptions({
      termId,
      subjectId,
    }),
  );
  return (
    <Select onValueChange={(val) => onChangeAction(val)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"Fiche de note"} />
      </SelectTrigger>
      <SelectContent>
        {gradeSheetQuery.data?.map((g, index) => (
          <SelectItem key={index} value={g.id.toString()}>
            {g.name} sur {g.scale}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
