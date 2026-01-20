"use client";

import { Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";

export function StudentHeader() {
  const t = useTranslations();
  const router = useRouter();
  const canCreateStudent = useCheckPermission("student.create");
  const canReadStudent = useCheckPermission("student.read");
  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="grid grid-cols-1 items-center justify-between gap-2 md:flex">
        <Label className="text-lg font-bold">{t("students")}</Label>

        <div className="grid grid-cols-2 items-center gap-3 md:flex">
          {canReadStudent && (
            <Button
              onClick={() => {
                window.open("/api/pdfs/student?format=csv", "_blank");
              }}
              variant="outline"
            >
              <Download />
              {t("Export")}
            </Button>
          )}
          {canCreateStudent && (
            <Button
              onClick={() => {
                router.push("/students/create");
              }}
            >
              <Plus />
              {t("add")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
