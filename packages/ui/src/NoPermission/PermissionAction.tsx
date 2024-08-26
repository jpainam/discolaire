"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/lib/hooks/use-locale";

import { Button } from "../button";

export function PermissionAction() {
  const { t } = useLocale();
  return (
    <Button
      onClick={() => {
        toast.info(t("not_yet_implemented"));
      }}
      size="sm"
      variant="outline"
    >
      <Mail className="mr-2 h-4 w-4" />
      {t("contactAdministrator")}
    </Button>
  );
}
