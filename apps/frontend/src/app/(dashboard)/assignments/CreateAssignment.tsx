"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";

export function CreateAssignment() {
  const { closeModal } = useModal();

  const t = useTranslations();
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 gap-2">
      <Label>{t("classrooms")}</Label>
      <ClassroomSelector
        className="col-span-2"
        defaultValue={classroomId ?? ""}
        onSelect={(val) => {
          setClassroomId(val == "" ? null : val);
        }}
      />
      <div className="col-span-2 h-4"></div>
      <Button
        type="button"
        variant={"outline"}
        onClick={() => {
          closeModal();
        }}
      >
        {t("cancel")}
      </Button>
      <Button
        onClick={() => {
          if (!classroomId) {
            toast.error(t("please_select_a_classroom"));
            return;
          }
          router.push(`/classrooms/${classroomId}/assignments/create`);
        }}
      >
        {t("submit")}
      </Button>
    </div>
  );
}
