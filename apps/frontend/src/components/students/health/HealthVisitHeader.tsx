"use client";

import { useParams } from "next/navigation";
import { Stethoscope } from "lucide-react";

//import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { routes } from "~/configs/routes";

export function HealthVisitHeader() {
  const { t } = useLocale();
  //const { openSheet } = useSheet();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  return (
    <div className="flex flex-row items-center gap-4 px-2 py-2">
      <Label>{t("medical_visits")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            router.push(routes.students.health.index(params.id) + "/new-visit");
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
