"use client";

import { Stethoscope } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useSheet } from "@repo/lib/hooks/use-sheet";
import { Button } from "@repo/ui/button";

import { CreateEditHealthVisit } from "./CreateEditHealthVisit";

export function HealthVisitHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-4 px-2 py-2">
      <div className="text-xl font-semibold">{t("Medical visits")}</div>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openSheet({
              className: "w-[700px]",
              view: <CreateEditHealthVisit />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          {t("New visit")}
        </Button>
      </div>
    </div>
  );
}
