"use client";

import { Stethoscope } from "lucide-react";
import { useParams } from "next/navigation";

//import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useSession } from "~/providers/AuthProvider";

export function HealthVisitHeader() {
  const { t } = useLocale();
  //const { openSheet } = useSheet();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const session = useSession();
  return (
    <div className="flex flex-row items-center gap-4 px-4 py-2">
      <Label>{t("medical_visits")}</Label>
      <div className="ml-auto">
        {session.user?.profile == "staff" && (
          <Button
            onClick={() => {
              router.push(
                routes.students.health.index(params.id) + "/new-visit"
              );
            }}
            variant={"default"}
            size={"sm"}
          >
            <Stethoscope />
            {t("new_visit")}
          </Button>
        )}
      </div>
    </div>
  );
}
