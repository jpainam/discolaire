"use client";

import { useParams } from "next/navigation";
import { Stethoscope } from "lucide-react";

//import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { authClient } from "~/auth/client";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

export function HealthVisitHeader() {
  const { t } = useLocale();

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  return (
    <div className="flex flex-row items-center gap-4 px-4 py-2">
      <Label>{t("medical_visits")}</Label>
      <div className="ml-auto">
        {session?.user.profile == "staff" && (
          <Button
            onClick={() => {
              router.push(
                routes.students.health.index(params.id) + "/new-visit",
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
