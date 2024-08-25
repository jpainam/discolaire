import { ReportCard } from "@/components/report-cards/ReportCard";
import { ReportCardHeader } from "@/components/report-cards/ReportCardHeader";
import { Separator } from "@repo/ui/separator";

export default function Page({
  searchParams,
}: {
  searchParams: { classroom?: string; student?: string; term?: string };
}) {
  return (
    <div className="flex flex-col">
      <ReportCardHeader />
      <Separator />
      <ReportCard searchParams={searchParams} />
    </div>
  );
}
