import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";

import { ReportCardTable } from "~/components/classrooms/report-cards/ReportCardTable2";
import { api } from "~/trpc/server";
import { getAppreciations } from "~/utils/get-appreciation";

export default async function Page(props: {
  searchParams: Promise<{ term: string }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { term } = searchParams;

  if (!term) {
    return <EmptyState className="my-8" />;
  }
  const grades = await api.reportCard.getGrades({
    classroomId: params.id,
    termId: Number(term),
  });
  const { result, summary } = await api.reportCard.getClassroom({
    termId: Number(term),
    classroomId: params.id,
  });
  const { t } = await getServerTranslations();
  return (
    <div className="flex w-full flex-col text-sm">
      <div className="grid flex-row items-center gap-4 px-2 py-1 md:flex">
        <FlatBadge variant={"green"}>
          {t("Moy.Max")} :{summary.max.toFixed(2)}
        </FlatBadge>
        <FlatBadge variant={"red"}>
          {t("Moy.Min")} : {summary.min.toFixed(2)}
        </FlatBadge>
        <FlatBadge variant={"blue"}>
          {t("Moy.Class")} : {summary.avg.toFixed(2)}
        </FlatBadge>
        <FlatBadge variant={"yellow"}>
          {t("success_rate")} : {(summary.successRate * 100).toFixed(2)}%
        </FlatBadge>
        <FlatBadge variant={"indigo"}>
          {t("effectif")} : {result.length}
        </FlatBadge>
        <FlatBadge variant={"gray"}>
          {t("appreciation")} : {getAppreciations(summary.avg)}
        </FlatBadge>
      </div>
      <Separator />

      <ReportCardTable
        term={Number(term)}
        result={result.sort((a, b) => a.rank - b.rank)}
        classroomId={params.id}
        grades={grades}
      />
    </div>
  );
}
