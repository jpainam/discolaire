"use client";

import { PlusIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

export function CreateRoleButton() {
  const { t } = useLocale();
  return (
    <Button
      size={"sm"}
      onClick={() => {
        console.log("create a role");
      }}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {t("add")}
    </Button>
  );
}
