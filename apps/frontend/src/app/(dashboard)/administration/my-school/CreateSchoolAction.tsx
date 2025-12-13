"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useRouter } from "~/hooks/use-router";

export function CreateSchoolAction() {
  const t = useTranslations();
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
