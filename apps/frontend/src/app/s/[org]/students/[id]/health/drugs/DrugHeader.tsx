"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditDrug } from "./CreateEditDrug";

export function DrugHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-4 py-2 border-b px-4">
      <Label>{t("drugs")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              title: t("add"),
              view: <CreateEditDrug studentId={params.id} />,
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
