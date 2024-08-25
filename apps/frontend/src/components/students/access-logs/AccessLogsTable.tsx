"use client";

import { User, Users } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { DirectionAwareTabs } from "@repo/ui/direction-aware-tabs";

export function AccessLogsTable({}) {
  const { t } = useLocale();
  const tabs = [
    {
      id: 0,
      label: (
        <div className="flex flex-row items-center gap-1">
          <User className="h-4 w-4" />
          {t("student")}
        </div>
      ),
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50 p-4">
          content of div1
        </div>
      ),
    },
    {
      id: 1,
      label: (
        <div className="flex flex-row items-center gap-1">
          <Users className="h-4 w-4" />
          {t("contacts")}
        </div>
      ),
      content: (
        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/50 p-4">
          content of div 1
        </div>
      ),
    },
  ];

  return (
    <div className="m-1 items-start justify-start">
      <DirectionAwareTabs rounded="rounded-md" tabs={tabs} />
    </div>
  );
}
