import { Suspense } from "react";

import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

import { getServerTranslations } from "~/app/i18n/server";
import { ReportCardSummary } from "~/components/students/report-cards/ReportCardSummary";
import { ReportCardTable } from "~/components/students/report-cards/ReportCardTable";
import { reportCardService } from "~/server/services/report-card-service";

export default async function Page({
  searchParams: { term },
  params: { id },
}: {
  params: { id: string };
  searchParams: { term: number };
}) {
  const { t } = await getServerTranslations();
  if (!term) {
    return <EmptyState className="my-8" />;
  }
  const reportCard = await reportCardService.getStudent(id, Number(term));
  return (
    <div className="flex w-full flex-col gap-2">
      <ReportCardTable reportCard={reportCard} />
      <Separator />
      <Suspense key={`grade-summary-${term}`}>
        <ReportCardSummary reportCard={reportCard} />
      </Suspense>
    </div>
  );
}
