"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { CreateEditSchoolYear } from "./CreateEditSchoolYear";

export function SchoolYearHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          title: `${t("create")} - ${t("schoolYear")}`,

          view: <CreateEditSchoolYear />,
        });
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon />
      {t("add")}
    </Button>
  );
}
