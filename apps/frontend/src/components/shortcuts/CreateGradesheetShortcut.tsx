"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { SubjectSelector } from "../shared/selects/SubjectSelector";
import { TermSelector } from "../shared/selects/TermSelector";

export function CreateGradesheetShortcut() {
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const t = useTranslations();
  const { closeModal } = useModal();
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          defaultValue=""
          onSelect={(val) => {
            setClassroomId(val);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          onChange={(val) => {
            setTermId(val);
          }}
        />
      </div>
      <div className="gap col-span-full flex flex-col gap-2">
        <Label>{t("subjects")}</Label>
        {classroomId ? (
          <SubjectSelector
            classroomId={classroomId}
            onChange={(val) => {
              setSubjectId(val ?? null);
            }}
          />
        ) : (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("subjects")} />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        )}
      </div>
      <div className="col-span-full flex flex-row items-center justify-end gap-2">
        <Button
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={!classroomId || !termId || !subjectId}
          onClick={() => {
            if (!classroomId || !termId || !subjectId) {
              toast.warning("Choisir tous les options");
              return;
            }
            router.push(
              `/classrooms/${classroomId}/gradesheets/create?termId=${termId}&subjectId=${subjectId}`,
            );
          }}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
