"use client";

import { Button } from "@repo/ui/components/button";
import { Download, Plus } from "lucide-react";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function StudentHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const canCreateStudent = useCheckPermission(
    "student",
    PermissionAction.CREATE
  );
  const canReadStudent = useCheckPermission("student", PermissionAction.READ);
  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{t("Student Management")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("Search and manage student records")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canReadStudent && (
            <Button
              onClick={() => {
                window.open("/api/pdfs/student?format=csv", "_blank");
              }}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4" />
              {t("Export")}
            </Button>
          )}
          {canCreateStudent && (
            <Button
              onClick={() => {
                router.push("/students/create");
              }}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {t("Add Student")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
