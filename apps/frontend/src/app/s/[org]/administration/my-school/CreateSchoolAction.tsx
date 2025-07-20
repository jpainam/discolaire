"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";

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
