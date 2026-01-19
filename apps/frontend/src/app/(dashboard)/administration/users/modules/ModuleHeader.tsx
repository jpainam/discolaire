"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { CreateEditModule } from "./CreateEditModule";

export function ModuleHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex items-center gap-2 px-4">
      <Label>Modules</Label>
      <div className="ml-auto flex items-center gap-4">
        <Button
          onClick={() => {
            openModal({
              title: t("add"),
              description: t("Module"),
              className: "sm:max-w-xl",
              view: <CreateEditModule />,
            });
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
