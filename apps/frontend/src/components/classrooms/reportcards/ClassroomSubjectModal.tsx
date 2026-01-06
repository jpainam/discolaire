"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";

export function ClassroomSubjectModal({
  classroomId,
  onSelectAction,
}: {
  classroomId: string;
  onSelectAction: (value: string) => void;
}) {
  const { closeModal } = useModal();
  const t = useTranslations();
  const [subjectId, setSubjectId] = useState<string | null>();
  return (
    <div className="flex flex-col gap-6">
      <SubjectSelector
        classroomId={classroomId}
        onChange={(val) => {
          setSubjectId(val);
        }}
      />
      <div className="ml-auto flex items-center justify-end gap-2">
        <Button
          variant={"secondary"}
          onClick={() => {
            closeModal();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={!subjectId}
          onClick={() => {
            if (!subjectId) {
              toast.warning("Veuillez choisir une matière");
              return;
            }
            onSelectAction(subjectId);
            closeModal();
          }}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
