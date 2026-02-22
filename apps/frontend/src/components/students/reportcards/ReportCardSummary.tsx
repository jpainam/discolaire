import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Separator } from "~/components/ui/separator";
import { getAppreciations } from "~/utils/appreciations";

export function ReportCardSummary({
  average,
  rank,
  classroom,
}: {
  average: number;
  id: string;
  rank: number;
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const t = useTranslations();

  return (
    <div className="flex-1 border text-xs">
      <div className="bg-muted/50 py-2 text-center font-bold">
        {t("result_summary")}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-2 p-2 font-bold">
        <span className="uppercase">{t("average")}</span>
        <span>{average.toFixed(2)}</span>
        <span className="uppercase">{t("rank")}</span>
        <span>
          {rank} / {classroom.size}
        </span>
        <span className="uppercase"> {t("appreciation")}</span>
        <span>{getAppreciations(average)}</span>
      </div>
      <Separator />
      <div className="bg-muted/50 py-2 text-center font-bold">
        {t("observations")}
      </div>
      <Separator />
      <div className="h-12"></div>
    </div>
  );
}
