"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";

interface AddButtonProps {
  onClick?: () => void;
}
export function AddButton({ onClick }: AddButtonProps) {
  const { t } = useLocale();
  return (
    <Button size={"sm"} onClick={onClick}>
      <PlusIcon className="mr-2 h-4 w-5" />
      {t("add")}
    </Button>
  );
}
