import { Separator } from "@repo/ui/components/separator";

import { ReportCard } from "~/components/report-cards/ReportCard";
import { ReportCardHeader } from "~/components/report-cards/ReportCardHeader";

export default async function Page(props: {
  searchParams: Promise<{
    classroom?: string;
    student?: string;
    term?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col">
      <ReportCardHeader />
      <Separator />
      <ReportCard searchParams={searchParams} />
    </div>
  );
}
