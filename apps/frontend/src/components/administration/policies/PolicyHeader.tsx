"use client";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { CreateEditPolicy } from "./CreateEditPolicy";

export function PolicyHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row px-4 py-2">
      <Label>{t("policy")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              className: "w-[500px]",
              title: t("create_policy"),
              view: <CreateEditPolicy />,
            });
          }}
        >
          {t("create")}
        </Button>
      </div>
    </div>
  );
}
