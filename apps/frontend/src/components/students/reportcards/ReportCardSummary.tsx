import { getTranslations } from "next-intl/server";

import { Separator } from "~/components/ui/separator";
import { caller } from "~/trpc/server";
import { getAppreciations } from "~/utils/appreciations";

export async function ReportCardSummary({
  average,
  rank,
  id,
}: {
  average: number;
  id: string;
  rank: number;
}) {
  const t = await getTranslations();
  const cl = await caller.student.classroom({ studentId: id });
  if (!cl) return null;
  const classroom = await caller.classroom.get(cl.id);
  return (
    <div className="flex-1 border text-sm">
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
