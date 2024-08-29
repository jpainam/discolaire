import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

export default function Page({
  searchParams: { term },
  params: { id },
}: {
  params: { id: string };
  searchParams: { term: number };
}) {
  //const { t } = await getServerTranslations();
  if (!term) {
    return <EmptyState className="my-8" />;
  }
  //const reportCard = await reportCardService.getStudent(id, Number(term));
  console.log(id);
  return (
    <div className="flex w-full flex-col gap-2">
      {/* <ReportCardTable reportCard={reportCard} /> */}
      <Separator />
      {/* <Suspense key={`grade-summary-${term}`}>
        <ReportCardSummary reportCard={reportCard} />
      </Suspense> */}
    </div>
  );
}
