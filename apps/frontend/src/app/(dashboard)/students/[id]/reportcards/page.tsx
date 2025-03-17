import { sum } from "lodash";

import type { RouterOutputs } from "@repo/api";
import { Separator } from "@repo/ui/components/separator";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { ReportCardDiscipline } from "~/components/students/reportcards/ReportCardDiscipline";
import { ReportCardMention } from "~/components/students/reportcards/ReportCardMention";
import { ReportCardPerformance } from "~/components/students/reportcards/ReportCardPerformance";
import { ReportCardSignature } from "~/components/students/reportcards/ReportCardSignature";
import { ReportCardSummary } from "~/components/students/reportcards/ReportCardSummary";
import { ReportCardTable } from "~/components/students/reportcards/ReportCardTable";
import { api } from "~/trpc/server";

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ term: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const searchParams = await props.searchParams;

  const { term } = searchParams;

  const { t } = await getServerTranslations();
  if (!term) {
    return <EmptyState className="my-8" title={t("select_terms")} />;
  }
  const { result: reportCard, summary } = await api.reportCard.getStudent({
    studentId: id,
    termId: Number(term),
  });
  if (reportCard.length === 0) {
    return <EmptyState className="my-8" title={t("no_data")} />;
  }

  const groups: Record<number, ReportCardType[]> = {};
  let totalCoeff = 0;

  reportCard.forEach((card) => {
    totalCoeff += card.isAbsent ? 0 : card.coefficient;
    const groupId = card.subjectGroupId;
    if (!groupId) return;
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(card);
  });
  const points = sum(
    reportCard.map((c) => (c.isAbsent ? 0 : c.avg * c.coefficient)),
  );

  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));

  const average = points / (totalCoeff || 1e9);

  return (
    <div className="flex w-full flex-col gap-2">
      <ReportCardTable groups={groups} />
      <Separator />
      <div className="flex flex-row items-start gap-2 p-2">
        <ReportCardMention id={id} />
        <ReportCardDiscipline id={id} />
        <ReportCardPerformance
          successRate={summary.successRate}
          max={summary.max}
          min={summary.min}
          avg={summary.avg}
        />
        <ReportCardSummary id={id} rank={summary.rank} average={average} />
      </div>
      <ReportCardSignature />
    </div>
  );
}

// <ReportCardSummary />;
