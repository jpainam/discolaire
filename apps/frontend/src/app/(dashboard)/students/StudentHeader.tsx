"use client";

import { Button } from "@repo/ui/components/button";
import { Download, Plus } from "lucide-react";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

export function StudentHeader() {
  const { t } = useLocale();
  const router = useRouter();
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            {t("Export")}
          </Button>
          <Button
            onClick={() => {
              router.push("/students/create");
            }}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            {t("Add Student")}
          </Button>
        </div>
      </div>
    </header>
  );
}
