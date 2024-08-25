"use client";

import { PlusIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

type AddButtonProps = {
  onClick?: () => void;
};
export function AddButton({ onClick }: AddButtonProps) {
  const { t } = useLocale();
  return (
    <Button size={"sm"} onClick={onClick}>
      <PlusIcon className="mr-2 h-4 w-5" />
      {t("add")}
    </Button>
  );
}
