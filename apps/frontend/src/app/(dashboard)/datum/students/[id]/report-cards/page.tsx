import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

import { ReportCardTable } from "~/components/students/report-cards/ReportCardTable";
import { api } from "~/trpc/server";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ term: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const searchParams = await props.searchParams;

  const {
    term
  } = searchParams;

  const { t } = await getServerTranslations();
  if (!term) {
    return <EmptyState className="my-8" title={t("select_terms")} />;
  }
  const reportCard = await api.reportCard.getStudent({
    studentId: id,
    termId: Number(term),
  });
  if (reportCard.length === 0) {
    return <EmptyState className="my-8" title={t("no_data")} />;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <ReportCardTable reportCard={reportCard} />
      <Separator />
      {/* <Suspense key={`grade-summary-${term}`}>
        <ReportCardSummary reportCard={reportCard} />
      </Suspense> */}
    </div>
  );
}
