"use client";

import { useTranslations } from "next-intl";

export function PreventedAttendance() {
  const t = useTranslations();
  return (
    <div className="flex flex-col border-l">
      <div className="flex flex-row items-center justify-between">
        <span className="text-xs font-semibold">
          {t("prevented_attendances")}
        </span>
      </div>
    </div>
  );
}
