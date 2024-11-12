"use client";

import { PlusIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { useRouter } from "~/hooks/use-router";

export function CreateSchoolAction() {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/admin/my-school/create");
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon className={"h-4 w-4"} />
      {t("add")}
    </Button>
  );
}
