"use client";

import { Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";

export function ClassroomHeader() {
  const t = useTranslations();

  const canCreateClassroom = useCheckPermission(
    "classroom",
    PermissionAction.CREATE,
  );
  const { openSheet } = useSheet();
  //const canReadStudent = useCheckPermission("student", PermissionAction.READ);
  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="grid grid-cols-1 items-center justify-between gap-2 md:flex">
        <div>
          <h1 className="text-xl font-bold">{t("classrooms")}</h1>
        </div>
        <div className="grid grid-cols-2 items-center gap-3 md:flex">
          {canCreateClassroom && (
            <Button
              onClick={() => {
                window.open(`/api/pdfs/classroom?format=csv`, "_blank");
              }}
              variant="outline"
            >
              <Download />
              {t("Export")}
            </Button>
          )}
          {canCreateClassroom && (
            <Button
              onClick={() => {
                const formId = "create-classroom-form";
                openSheet({
                  formId,
                  title: t("create"),
                  description: t("classroom"),
                  view: <CreateEditClassroom formId={formId} />,
                });
              }}
            >
              <Plus />
              {t("Add")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
