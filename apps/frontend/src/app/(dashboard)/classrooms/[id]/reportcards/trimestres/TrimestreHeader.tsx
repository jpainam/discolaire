"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Printer } from "lucide-react";
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";
import { getAppreciations } from "~/utils/get-appreciation";

export function TrimestreHeader({
  classroom,
  title,
  trimestreId,
  successRate,
  averages,
}: {
  title: string;
  classroom: RouterOutputs["classroom"]["get"];
  averages: number[];
  successRate: number;
  trimestreId: string;
}) {
  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  return (
    <div className="grid flex-row items-center gap-4 px-4 md:flex">
      <Label className="uppercase font-bold">{title}</Label>
      <FlatBadge variant={"green"}>
        {t("Moy.Max")} :{Math.max(...averages).toFixed(2)}
      </FlatBadge>
      <FlatBadge variant={"red"}>
        {t("Moy.Min")} : {Math.min(...averages).toFixed(2)}
      </FlatBadge>
      <FlatBadge variant={"blue"}>
        {t("Moy.Class")} : {average.toFixed(2)}
      </FlatBadge>
      <FlatBadge variant={"yellow"}>
        {t("success_rate")} : {(successRate * 100).toFixed(2)}%
      </FlatBadge>
      <FlatBadge variant={"indigo"}>
        {t("effectif")} : {classroom.size}
      </FlatBadge>
      <FlatBadge variant={"gray"}>
        {t("appreciation")} : {getAppreciations(average)}
      </FlatBadge>
      <Button
        className="ml-auto"
        onClick={() => {
          const url =
            `/api/pdfs/reportcards/ipbw/trimestres?` +
            createQueryString({
              trimestreId: trimestreId,
              classroomId: classroom.id,
              format: "pdf",
            });
          window.open(url, "_blank");
        }}
        variant={"default"}
        size={"sm"}
      >
        <Printer />
        {t("print")}
      </Button>
    </div>
  );
}
