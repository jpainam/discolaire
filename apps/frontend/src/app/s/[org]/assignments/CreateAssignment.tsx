"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useRouter } from "~/hooks/use-router";

export function CreateAssignment() {
  const { closeModal } = useModal();
  const { t } = useLocale();
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 gap-2">
      <Label>{t("classrooms")}</Label>
      <ClassroomSelector
        className="col-span-2"
        onChange={(val) => {
          setClassroomId(val ?? null);
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
