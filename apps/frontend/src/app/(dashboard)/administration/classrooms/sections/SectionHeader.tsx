"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useModal } from "~/hooks/use-modal";
import { CreateEditSection } from "./CreateEditSection";

export function SectionHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2 px-2">
      <Label>{t("sections")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              title: t("create"),
              view: <CreateEditSection />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
