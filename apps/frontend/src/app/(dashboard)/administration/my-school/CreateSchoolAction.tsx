"use client";

import { PlusIcon } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

export function CreateSchoolAction() {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/administration/my-school/create");
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon className={"h-4 w-4"} />
      {t("add")}
    </Button>
  );
}
