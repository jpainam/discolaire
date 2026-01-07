"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { hasPreviousGradesheet } from "~/actions/grade";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";

export function CreateClassroomGradeSheetModal({
  termId,
  subjectId,
  classroomId,
  onSelectAction,
}: {
  termId: string | null;
  subjectId: string | null;
  classroomId: string;
  onSelectAction: (termId: string, subjectId: string) => void;
}) {
  const { closeModal } = useModal();
  const t = useTranslations();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(termId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    subjectId,
  );
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>{t("terms")}</Label>
        <TermSelector
          onChange={(t) => {
            setHasError(false);
            void setSelectedTermId(t);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("subjects")}</Label>
        <SubjectSelector
          classroomId={classroomId}
          onChange={(s) => {
            setHasError(false);
            void setSelectedSubjectId(s);
          }}
        />
      </div>
      {hasError && (
        <div className="text-destructive text-xs">
          Une note a déjà été saisie pour cette période
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => {
            closeModal();
          }}
          variant={"secondary"}
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={!selectedTermId || !selectedSubjectId || isLoading}
          onClick={async () => {
            if (!selectedTermId || !selectedSubjectId) {
              toast.warning(
                "Veuillez sélectionner une période et une matière.",
              );
              return;
            }
            setIsLoading(true);
            const hasGrade = await hasPreviousGradesheet({
              termId: selectedTermId,
              subjectId: Number(selectedSubjectId),
            });
            setIsLoading(false);
            if (hasGrade) {
              setHasError(true);
              return;
            }
            onSelectAction(selectedTermId, selectedSubjectId);
            closeModal();
          }}
        >
          {isLoading && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
