import { EmptyState } from "@repo/ui/EmptyState";

import { ReportCardTable } from "~/components/classrooms/report-cards/ReportCardTable";

export default async function Page(props: {
  searchParams: Promise<{ term: string }>;
}) {
  const searchParams = await props.searchParams;

  const { term } = searchParams;

  if (!term) {
    return <EmptyState className="my-8" />;
  }
  return (
    <div className="flex w-full flex-col">
      <ReportCardTable />
    </div>
  );
}
