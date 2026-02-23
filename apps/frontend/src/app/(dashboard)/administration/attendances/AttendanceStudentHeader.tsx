"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { CreateStudentAttendance } from "./CreateStudentAttendance";

export function AttendanceStudentHeader() {
  const { openModal } = useModal();
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2">
      <Label>{t("attendances")}</Label>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: "Créer",
              description: "Saisir toutes les présences",
              className: "sm:max-w-xl",
              view: <CreateStudentAttendance />,
            });
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
