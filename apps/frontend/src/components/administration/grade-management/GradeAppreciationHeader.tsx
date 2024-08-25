"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { useModal } from "~/hooks/use-modal";
import { CreateEditAppreciation } from "./CreateEditAppreciation";

export function GradeAppreciationHeader() {
  const params = useParams() as { id: string; appreciationId: string };
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex w-full flex-row items-center gap-4 border-b py-1">
      <Label>{t("appreciation_list")}</Label>
      <div className="ml-auto flex items-center gap-1">
        <Button
          onClick={() => {
            openModal({
              title: t("new_appreciation"),
              className: "w-[500px]",
              description: <AppreciationExample />,
              view: <CreateEditAppreciation />,
            });
          }}
          size="sm"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("new")}
          </span>
        </Button>
      </div>
    </div>
  );
}

function AppreciationExample() {
  const { t } = useLocale();
  return (
    <p className="flex flex-row gap-2">
      <span>e.g.,</span>
      <span className="ml-10 flex flex-col gap-0 text-muted-foreground">
        <span>[12, {t("fair")}]</span>
        <span>[13, {t("pretty_good")}]</span>
        <span>[15, {t("good")}]</span>
        <span>[18, {t("very_good")}]</span>
        <span>[20, {t("excellent")}]</span>
      </span>
    </p>
  );
}
