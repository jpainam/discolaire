"use client";

import { Button } from "@repo/ui/components/button";
import { Download, Plus } from "lucide-react";
import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function ClassroomHeader() {
  const { t } = useLocale();

  const canCreateClassroom = useCheckPermission(
    "classroom",
    PermissionAction.CREATE
  );
  const { openSheet } = useSheet();
  //const canReadStudent = useCheckPermission("student", PermissionAction.READ);
  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{t("Classroom Management")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("classroom_title_description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canCreateClassroom && (
            <Button
              onClick={() => {
                window.open(`/api/pdfs/classroom?format=csv`, "_blank");
              }}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4" />
              {t("Export")}
            </Button>
          )}
          {canCreateClassroom && (
            <Button
              onClick={() => {
                openSheet({
                  title: t("create_a_classroom"),
                  description: t("create_classroom_description"),
                  view: <CreateEditClassroom />,
                });
              }}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {t("Add Classroom")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
