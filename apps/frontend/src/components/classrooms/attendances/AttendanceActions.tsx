"use client";

import { BookMarked, Check, Home, X } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

export function AttendanceActions() {
  const { t } = useLocale();
  return (
    <div className="my-2 flex flex-row items-center justify-center gap-4 px-2">
      <div className="flex items-center gap-1">
        <Button size="sm" variant="default" className="h-8 gap-1">
          <Check className="h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("mark_all_present")}
          </span>
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="destructive" className="h-8 gap-1">
          <X className="h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("mark_all_absent")}
          </span>
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" className="h-8 gap-1 bg-secondary">
          <BookMarked className="h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("mark_all_late")}
          </span>
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Home className="h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("mark_all_holiday")}
          </span>
        </Button>
      </div>
    </div>
  );
}
