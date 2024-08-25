import { EmptyState } from "@repo/ui/EmptyState";

import { ReportCardTable } from "~/components/classrooms/report-cards/ReportCardTable";

export default function Page({
  searchParams: { term },
}: {
  searchParams: { term: string };
}) {
  if (!term) {
    return <EmptyState className="my-8" />;
  }
  return (
    <div className="flex w-full flex-col">
      <ReportCardTable />
    </div>
  );
}
